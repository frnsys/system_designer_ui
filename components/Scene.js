import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import Events from 'src/Events';
import Edge from './edges/Edge';
import TentativeEdge from './edges/Tentative';
import HTML5Backend from 'react-dnd-html5-backend';
import { DropTarget, DragDropContext } from 'react-dnd';

const zoomSpeed = 0.001;
const maxZoom = 1.8;
const minZoom = 0.2;

const dropTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const module = component.modules[item.id];
    const pos = module.state.position;
    const left = Math.round(pos.x + (delta.x * 1/component.state.zoom));
    const top = Math.round(pos.y + (delta.y * 1/component.state.zoom));
    module.setState({
      position: {
        x: left,
        y: top
      }
    }, function() {
      setTimeout(function () {
        window.requestAnimationFrame(function() {
          module.updateInputBoxes();
          module.updateOutputBoxes();
        })
      }, 0)
    });
  }
};


class Scene extends React.Component {
  constructor(props, context) {
    super(props, context);

    // we hide edges to the module
    // being dragged. the html5 drag-and-drop
    // backend does not support events while dragging,
    // so we can't re-draw connections to the
    // dragging preview module. it looks ok if we just hide the edges
    // until it's done being dragged.
    this.state = {
      draggingModuleId: undefined,
      zoom: 1,
      panning: false,
      offset: {
        x: 0,
        y: 0
      }
    };

    // these are used so modules and edges can
    // communicate with each other (is there a better way?)
    this.modules = {};
    this.edges = {};

    this.lastCursorPos = {x:0,y:0};

    this._removeEdge = this.removeEdge.bind(this);
  }

  registerModule(id, el) {
    if (el !== null) {
      this.modules[id] = el.decoratedComponentInstance;
    }
  }

  registerEdge(id, el) {
    // not checking for null b/c if an edge is
    // unmounted, we want to know
    this.edges[id] = el;
  }

  zoom(e) {
    e.preventDefault();
    var zoom = this.state.zoom - (e.deltaY * zoomSpeed);
    zoom = Math.min(maxZoom, zoom);
    zoom = Math.max(minZoom, zoom);

    var before = this.truePos(this.lastCursorPos, this.state.zoom);
    var after = this.truePos(this.lastCursorPos, zoom);
    var offset = {
      x: this.state.offset.x + -(before.x - after.x),
      y: this.state.offset.y + -(before.y - after.y)
    }

    this.setState({
      zoom: zoom,
      offset: offset
    });
  }

  pan(e) {
    if (this.state.panning) {
      // scale by zoom amount for consistent panning distance
      var delta = {
        x: (e.clientX - this.state.panStart.x) * (1/this.state.zoom),
        y: (e.clientY - this.state.panStart.y) * (1/this.state.zoom)
      }
      this.setState({
        offset: {
          x: this.state.offset.x + delta.x,
          y: this.state.offset.y + delta.y
        },
        panStart: {
          x: e.clientX,
          y: e.clientY,
        }
      });
    }
  }

  startPan(e) {
    // check that the click is
    // on an empty part of the scene
    // which happens to be the edges element
    // or the scene if zoomed out
    if (e.target.classList.contains('edges') || e.target.classList.contains('scene')) {
      this.setState({
        panning: true,
        panStart: {
          x: e.clientX,
          y: e.clientY,
        }
      });
    }
  }

  render() {
    const stageStyle = {
      transform: `scale(${this.state.zoom}) translate(${this.state.offset.x}px, ${this.state.offset.y}px)`
    }
    return this.props.connectDropTarget(
      <div className={`scene ${this.state.panning ? 'panning': ''}`}
        onMouseDown={this.startPan.bind(this)}
        onMouseUp={() => this.setState({panning: false})}
        onMouseMove={this.pan.bind(this)}>
        <div className="scene-stage" ref="stage" style={stageStyle}>
          <div className="modules">
            {
              Object.keys(this.props.project.graph.modules).map(modId =>
                this.props.project.graph.modules[modId].component(this))
            }
          </div>
          <svg className="edges">
            <defs>
              <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#00FF7C"/>
                <stop offset="100%" stopColor="#ff7676"/>
              </linearGradient>
            </defs>
            <TentativeEdge ref="tentativeEdge"/>
            {
              this.props.project.graph.allEdges
                .filter((edge) => edge.from.id != this.state.draggingModuleId && edge.to.id != this.state.draggingModuleId)
                .map((edge, i) =>
                  <Edge edge={edge} key={i} scene={this}
                    toModule={this.modules[edge.to.id]}
                    fromModule={this.modules[edge.from.id]}
                    onClick={this._removeEdge}
                    ref={this.registerEdge.bind(this, edge.id)}/>
              )
            }
          </svg>
        </div>
      </div>
    );
  }

  componentDidMount() {
    var self = this;
    this.rerender = function(data) {
      self.forceUpdate.bind(self)();
    };
    Events.on('module_added', this.rerender);

    this._zoom  = this.zoom.bind(this);
    this._updateTentativeEdge = this.updateTentativeEdge.bind(this);
    this._releaseTentativeEdge = this.releaseTentativeEdge.bind(this);
    this._updateCursorPos = this.updateCursorPos.bind(this);
    document.addEventListener('mousemove', this._updateTentativeEdge);
    document.addEventListener('mousemove', this._updateCursorPos);

    document.addEventListener('wheel', this._zoom);
  }

  updateTentativeEdge(ev) {
    const line = this.refs.tentativeEdge;
    const domNode = ReactDOM.findDOMNode(this);
    var pos = this.truePos({
      x: ev.clientX,
      y: ev.clientY
    }, this.state.zoom)
    line.setState({
      drawToX: pos.x,
      drawToY: pos.y
    });
  }

  releaseTentativeEdge(ev) {
    const line = this.refs.tentativeEdge;
    document.removeEventListener('mousedown', this._releaseTentativeEdge);

    if (line.state.visible) {
      line.setState({
        visible: false
      });

      const elem = document.elementFromPoint(ev.clientX, ev.clientY);
      if (!elem) {
        return;
      }

      const input = elem.closest('[data-input-index]');
      if (!input) {
        return;
      }

      const toModuleElem = elem.closest('[data-module-id]');
      if (!toModuleElem) {
        return;
      }

      this.props.project.graph.addEdge(
        line.state.fromModule,
        line.state.outputNum,
        this.props.project.graph.modules[toModuleElem.dataset.moduleId],
        parseInt(input.dataset.inputIndex));
    }
  }

  componentWillUnmount() {
    Events.off('module_added', this.rerender);
    document.removeEventListener('mousemove', this._updateTentativeEdge);
    document.removeEventListener('mousemove', this._updateCursorPos);
    document.removeEventListener('wheel', this._zoom);
  }

  removeEdge(edge) {
    this.props.project.graph.removeEdge(edge);
    delete this.edges[edge.id];
    this.forceUpdate();
  }

  removeModule(module) {
    this.props.project.graph.removeModule(module);
    delete this.modules[module.id];
    this.forceUpdate();
  }

  drawTentativeEdge(fromModule, outputNum, x, y) {
    const line = this.refs.tentativeEdge;
    const domNode = ReactDOM.findDOMNode(this);
    var pos = this.truePos({
      x: x,
      y: y
    }, this.state.zoom)
    line.setState({
      fromModule: fromModule,
      outputNum: outputNum,
      startX: pos.x,
      startY: pos.y,
      visible: true
    });
    document.addEventListener('mousedown', this._releaseTentativeEdge);
  }

  truePos(pos, zoom) {
    return {
      x: pos.x/zoom - this.state.offset.x,
      y: pos.y/zoom - this.state.offset.y
    };
  }

  updateCursorPos(ev) {
    this.lastCursorPos.x = ev.pageX;
    this.lastCursorPos.y = ev.pageY;
  }
}

Scene.propTypes = {
  project: React.PropTypes.object.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired
}

export default DragDropContext(HTML5Backend)(
  DropTarget(
    'module',
    dropTarget,
    connect => ({
      connectDropTarget: connect.dropTarget()
    })
  )(Scene));
