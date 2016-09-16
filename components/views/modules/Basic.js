import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import { DragSource } from 'react-dnd';
import TextField from '../fields/Text';
import { VictoryChart, VictoryAxis, VictoryLine } from 'victory';
import { jStat } from 'jstat';
import BaseVariable from '../Variable';

const dragSource = {
  beginDrag(props) {
    props.scene.setState({
      draggingModuleId: props.module.id
    });
    return {id: props.module.id};
  },

  endDrag(props) {
    props.scene.setState({
      draggingModuleId: undefined
    });
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class BasicModule extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disableDrag: false,
      name: 'Basic Module',
      vars: props.module.ins.reduce(function(m,inp) {
        m[inp] = 0;
        return m
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


        // <VictoryChart domain={this.state.domain}>
        //   <VictoryLine y={(data) => jStat.normal.pdf(data.x, this.state.vars.mean, this.state.vars.std)} />
        // </VictoryChart>

    const element = <div className="module module-basic"
        data-module-id={this.props.module.id}
        style={style}>
        <div className="outputs">
            {outputs}
        </div>
        {name}
        <ul className="variables">
          {
            this.props.module.ins.map((input, i) =>
              <BaseVariable name={input} inputNum={i} onChange={this.onVarChange.bind(this)} ref={this.registerInputPosition.bind(this)} key={i} />)
          }
        </ul>
      </div>;
    if (this.state.disableDrag) {
      return element;
    } else {
      return this.props.connectDragSource(element);
    }
  }

  onVarChange(val) {
    console.log(val);
  }

  serverCallback(state) {
    var newState = {vars:{}};
    console.log('calling server (fake)')
    console.log(state);
    Object.keys(state).forEach(function(key) {
      if (key.indexOf('vars') === 0) {
        newState.vars[key.substring('vars'.length+1)] = state[key];
      } else {
        newState[key] = state[key];
      }
    });
    newState.vars = _.extend({}, this.state.vars, newState.vars);
    console.log(newState);
    this.setState(newState);
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


BasicModule.propTypes = {
  project: React.PropTypes.object.isRequired,
  module: React.PropTypes.object.isRequired,
  scene: React.PropTypes.object.isRequired,
  disableDrag: React.PropTypes.bool.isRequired,

  // required by react-dnd
  isDragging: React.PropTypes.bool.isRequired,
  connectDragSource: React.PropTypes.func.isRequired
};
BasicModule.defaultProps = {disableDrag: false};

export default DragSource(
  'module',
  dragSource,
  collect
)(BasicModule);
