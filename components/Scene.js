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
    const {x, y} = component.props.project.positions[item.id];
    const left = Math.round(x + delta.x);
    const top = Math.round(y + delta.y);
    component.props.project.positions[item.id] = {x: left, y: top};
  }
};


class Scene extends React.Component {
  constructor(props, context) {
    super(props, context);

    // we hide edges to the module
    // being dragged. the html5 drag-and-drop
    // backend does not support events while dragging,
    // so we can't re-draw connections to the\
    // dragging preview module. it looks ok if we just hide the edges
    // until it's done being dragged.
    this.state = {
      draggingModuleId: undefined,
      zoom: 1
    };

    // these are used so modules and edges can
    // communicate with each other (is there a better way?)
    this.modules = {};
    this.edges = {};
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
    var zoom = this.state.zoom - (e.deltaY * zoomSpeed);
    zoom = Math.min(maxZoom, zoom);
    zoom = Math.max(minZoom, zoom);
    this.setState({
      zoom: zoom
    });
  }

  render() {
    return this.props.connectDropTarget(
      <div className="scene" style={{transform: `scale(${this.state.zoom})`}}>
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
          <TentativeEdge ref="tentativeEdge" />
          {
            this.props.project.graph.allEdges
              .filter((edge) => edge.from.id != this.state.draggingModuleId && edge.to.id != this.state.draggingModuleId)
              .map((edge, i) =>
                <Edge edge={edge} key={i}
                  toModule={this.modules[edge.to.id]}
                  fromModule={this.modules[edge.from.id]}
                  onClick={this.removeEdge.bind(this, edge)}
                  ref={this.registerEdge.bind(this, edge.id)}/>
            )
          }
        </svg>
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
    document.addEventListener('mousemove', this._updateTentativeEdge);

    document.addEventListener('wheel', this._zoom);
  }

  updateTentativeEdge(ev) {
    const line = this.refs.tentativeEdge;
    const domNode = ReactDOM.findDOMNode(this);
    const offset = domNode.getClientRects()[0];
    line.setState({
      drawToX: ev.clientX - offset.left,
      drawToY: ev.clientY - offset.top
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
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    Events.off('module_added', this.rerender);
    document.removeEventListener('mousemove', this._updateTentativeEdge);
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
    const offset = domNode.getClientRects()[0];
    line.setState({
      fromModule: fromModule,
      outputNum: outputNum,
      startX: x - offset.left,
      startY: y - offset.top,
      visible: true
    });
    document.addEventListener('mousedown', this._releaseTentativeEdge);
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
