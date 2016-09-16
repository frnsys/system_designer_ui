import React from 'react';
import NumberField from './fields/Number';

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class BaseVariable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      val: props.val
    };
  }

  render() {
    return <li className="variable">
      <span className="input" data-input-index={this.props.inputNum} key={"input_" + this.props.inputNum} ref="input"></span>
      <div className="variable-display"><label>{this.props.name}: </label><NumberField
          value={this.state.val} onFinish={this.props.onChange} name="val" /></div>
    </li>
  }
};


BaseVariable.propTypes = {
  name: React.PropTypes.string.isRequired,
  val: React.PropTypes.number.isRequired,
  inputNum: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
};
BaseVariable.defaultProps = {val: 0};

export default BaseVariable;
