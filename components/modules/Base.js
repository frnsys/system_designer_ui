import React from 'react';
import _ from 'underscore';
import ReactDOM from 'react-dom';
import Draggable from './Draggable';
import TextField from '../fields/Text';
import BaseVariable from '../Variable';

class BaseModule extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disableDrag: false,
      name: 'Base Module',
      vars: Object.keys(props.module.ins).reduce(function(m, name) {
        m[name] = props.module.ins[name].default || 0;
        return m;
      }, {})
    };
    this.inputPositions = {};
    this.outputPositions = {};
  }

  registerInputPosition(el) {
    if (el !== null && !(el.props.inputNum in this.inputPositions)) {
      this.inputPositions[el.props.inputNum] = _.clone(ReactDOM.findDOMNode(el.refs.input).getBoundingClientRect());
    }
  }

  registerOutputPosition(i, el) {
    if (el !== null && !(i in this.outputPositions)) {
      this.outputPositions[i] = _.clone(ReactDOM.findDOMNode(el).getBoundingClientRect());
    }
  }

  renderDisplay() {
    // define in subclasses
  }

  render() {
    // hide while dragging
    if (this.props.isDragging) {
      return null;
    }
    const pos = this.props.project.positions[this.props.module.id];
    const style = {
      position: 'absolute',
      top: pos.y,
      left: pos.x,
      opacity: this.props.isDragging ? 0.5 : 1
    };
    const nameField = <TextField
      value={this.state.name}
      onFinish={this.serverCallback.bind(this)}
      name="name"
      className="module-name" />;

    var outputs, name;
    if (this.props.module.outs.length === 1) {
      name = <div className="variable">{nameField}<span className="output" outputNum="0"
              onMouseDown={this.onOutputMouseDown.bind(this, 0)}
              onMouseEnter={() => this.setState({ disableDrag: true })}
              onMouseLeave={() => this.setState({ disableDrag: false })}
              ref={this.registerOutputPosition.bind(this, 0)}
              key="0" /></div>;
      outputs = '';
    } else {
      name = <div>{nameField}</div>;
      outputs = this.props.module.outs.map((output, i) =>
          <span className="output" outputNum={i}
            onMouseDown={this.onOutputMouseDown.bind(this, i)}
            onMouseEnter={() => this.setState({ disableDrag: true })}
            onMouseLeave={() => this.setState({ disableDrag: false })}
            key={i}
            ref={this.registerOutputPosition.bind(this, i)}
          />
        , this);
    }

    const element = <div className="module module-basic" data-module-id={this.props.module.id} style={style}>
        {this.renderDisplay()}
        {name}
        <ul className="variables">
          {
            Object.keys(this.state.vars).map((name, i) =>
              <BaseVariable name={name} inputNum={i} onChange={this.onVarChange.bind(this)} ref={this.registerInputPosition.bind(this)} key={i} val={this.state.vars[name]} validate={this.props.module.ins[name].validate}/>)
          }
        </ul>
        <div className="outputs">{outputs}</div>
      </div>;
    if (this.state.disableDrag) {
      return element;
    } else {
      return this.props.connectDragSource(element);
    }
  }

  onVarChange(update, finished) {
    this.setState({
      vars: Object.assign(this.state.vars, update)
    });
  }

  serverCallback(state) {
    // TODO this is fake
    console.log('calling server (fake)')
    this.setState(state);
  }

  onOutputMouseDown(outputNum, ev) {
    this.props.scene.drawTentativeEdge(
      this.props.module,
      outputNum,
      ev.clientX,
      ev.clientY);
    ev.stopPropagation();
  }
};


BaseModule.propTypes = {
  project: React.PropTypes.object.isRequired,
  module: React.PropTypes.object.isRequired,
  scene: React.PropTypes.object.isRequired,
  disableDrag: React.PropTypes.bool.isRequired,

  // required by react-dnd
  isDragging: React.PropTypes.bool.isRequired,
  connectDragSource: React.PropTypes.func.isRequired
};
BaseModule.defaultProps = {disableDrag: false};

export default BaseModule;
