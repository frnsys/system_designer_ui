import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import Events from 'src/Events';
import Edge from './edges/Edge';
import TentativeEdge from './edges/Tentative';
import HTML5Backend from 'react-dnd-html5-backend';
import { DropTarget, DragDropContext } from 'react-dnd';

const dropTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const {x, y} = component.props.project.positions[item.id];
    const left = Math.round(x + delta.x);
    const top = Math.round(y + delta.y);
    let mod = component.modules[item.id];
    component.props.project.positions[item.id] = {x: left, y: top};

    // update all input and output positions
    ['inputPositions', 'outputPositions'].forEach((k) => {
      Object.keys(mod[k]).forEach((id) => {
        mod[k][id].top += delta.y;
        mod[k][id].left += delta.x;
      })
    });
    component.forceUpdate();
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
    this.state = {draggingModuleId: undefined};
    this.modules = {};
  }

  registerModule(id, el) {
    if (!(id in this.modules)) {
      this.modules[id] = el.decoratedComponentInstance;
    }
  }

  render() {
    return this.props.connectDropTarget(
      <div className="scene">
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
                <Edge edge={edge} scene={this}
                  project={this.props.project} key={i} />
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

    this._updateTentativeEdge = this.updateTentativeEdge.bind(this);
    this._releaseTentativeEdge = this.releaseTentativeEdge.bind(this);
    document.addEventListener('mousemove', this._updateTentativeEdge);
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
