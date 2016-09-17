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
      name: props.module.name,
      vars: Object.keys(props.module.ins).reduce(function(m, name) {
        m[name] = props.module.ins[name].default || 0;
        return m;
      }, {})
    };

    this._inputs = {};
    this._outputs = {};
    this.inputBoxes = {};
    this.outputBoxes = {};
  }

  registerInput(comp) {
    if (comp !== null) {
      this._inputs[parseInt(comp.props.inputNum)] = comp.refs.input;
    }
  }

  registerOutput(i, comp) {
    if (comp !== null) {
      this._outputs[i] = comp;
    }
  }

  updateInputBoxes() {
    Object.keys(this._inputs).forEach(i => {
      this.inputBoxes[i] = _.clone(ReactDOM.findDOMNode(this._inputs[i]).getBoundingClientRect());
    });

    // ensure that incoming edges are pointed to the correct position
    let inEdges = this.props.project.graph.inEdges[this.props.module.id] || [];
    Object.keys(inEdges).forEach(i => {
      let edge = inEdges[i],
          edgeComponent = this.props.scene.edges[edge.id],
          box = this.inputBoxes[edge.input];
      if (edgeComponent) {
        edgeComponent.setState({
          head: {
            x: box.left,
            y: box.top
          }
        });
      }
    });
  }

  updateOutputBoxes() {
    Object.keys(this._outputs).forEach(i => {
      this.outputBoxes[i] = _.clone(ReactDOM.findDOMNode(this._outputs[i]).getBoundingClientRect());
    });

    // ensure that outgoing edges are pointed to the correct position
    let outEdges = this.props.project.graph.outEdges[this.props.module.id] || [];
    Object.keys(outEdges).forEach(i => {
      let edges = outEdges[i]; // one output can go to multiple inputs
      edges.forEach(edge => {
        let edgeComponent = this.props.scene.edges[edge.id],
            box = this.outputBoxes[edge.output];
        if (edgeComponent) {
          edgeComponent.setState({
            tail: {
              x: box.left,
              y: box.top
            }
          });
        }
      });
    });
  }

  componentDidUpdate() {
    if (!this.props.isDragging) {
      this.updateInputBoxes();
      this.updateOutputBoxes();
    }
  }

  toggleControls(show) {
    this.refs.controls.style.display = show ? 'block' : 'none';
  }

  // define in subclasses
  renderControls() {}
  renderDisplay() {}

  render() {
    // hide while dragging
    if (this.props.isDragging) {
      return null;
    }
    const pos = this.props.project.positions[this.props.module.id]; // TODO this might not be necessary anymore do it a diff way
    const style = {
      position: 'absolute',
      top: pos.y,
      left: pos.x,
      opacity: this.props.isDragging ? 0.5 : 1
    };
    const nameField = <TextField
      value={this.state.name}
      onChange={this.serverCallback.bind(this)}
      onFinish={this.serverCallback.bind(this)}
      name="name"
      className="module-name" />;

    var outputs, name;
    if (this.props.module.outs.length === 1) {
      name = <div className="variable">{nameField}<span className="output" outputNum="0"
              onMouseDown={this.onOutputMouseDown.bind(this, 0)}
              onMouseEnter={() => this.setState({ disableDrag: true })}
              onMouseLeave={() => this.setState({ disableDrag: false })}
              ref={this.registerOutput.bind(this, 0)}
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
            ref={this.registerOutput.bind(this, i)}
          />
        , this);
    }

    const element = <div
      className={`module module-${this.moduleType}`}
      data-module-id={this.props.module.id}
      onMouseEnter={this.toggleControls.bind(this, true)}
      onMouseLeave={this.toggleControls.bind(this, false)}
      style={style}>
        {this.renderControls()}
        {this.renderDisplay()}
        {name}
        <ul className="variables">
          {
            Object.keys(this.state.vars).map((name, i) =>
              <BaseVariable name={name}
                key={i}
                inputNum={i}
                onChange={this.onVarChange.bind(this)}
                ref={this.registerInput.bind(this)}
                val={this.state.vars[name]}
                validate={this.props.module.ins[name].validate}/>)
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

BaseModule.moduleType = 'base';
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
