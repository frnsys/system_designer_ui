import React from 'react';
import ReactDOM from 'react-dom';
import BaseField from './Base';
import { bindHandlers } from 'src/Util';

class TextField extends BaseField {
  constructor(props, context) {
    super(props, context);

    bindHandlers(this, [
      'keyDown',
      'changed',
      'startEditing',
      'finishEditing',
      'cancelEditing']);
  }

  keyDown(event) {
    if (event.keyCode === 13) { // enter
      this.finishEditing();
    } else if (event.keyCode === 27) { // esc
      this.cancelEditing();
    }
  };

  startEditing() {
    this.setState({editing: true});
  }

  selectInputText(element) {
    element.setSelectionRange(0, element.value.length);
  }

  componentDidUpdate(prevProps, prevState) {
    var inputElem = ReactDOM.findDOMNode(this.refs.input);
    if (this.state.editing && !prevState.editing) {
        inputElem.focus();
        this.selectInputText(inputElem);
    } else if (this.state.editing && prevProps.text != this.props.text) {
        this.finishEditing();
    }
  }

  validate(val) {
    return val && super.validate(val);
  }

  processVal(val) {
    return val;
  }

  processUpdate() {
    let val = this.processVal(ReactDOM.findDOMNode(this.refs.input).value),
        valid = this.validate(val);
    this.setState({invalid: !valid});
    if (valid) {
      let update = {};
      update[this.props.name] = val;
      return update;
    }
    return false;
  }

  finishEditing() {
    let update = this.processUpdate();
    if (update) {
      this.props.onFinish(update);
    }
    this.cancelEditing();
  }

  cancelEditing() {
    this.setState({editing: false, invalid: false});
  }

  changed() {
    if (this.props.onChange) {
      let update = this.processUpdate();
      if (update) {
        this.props.onChange(update);
      }
    }
  }

  renderField() {
    return <input
            defaultValue={this.props.value}
            onInput={this.changed}
            onBlur={this.finishEditing}
            ref="input"
            onKeyDown={this.keyDown} />;
  }

  renderValue() {
    return <span
      tabIndex="0"
      style={{cursor: 'pointer'}}
      onFocus={this.startEditing}
      onClick={this.startEditing}>{this.props.value}</span>;
  }

  render() {
    return this.state.editing ? this.renderField() : this.renderValue();
  }
}

export default TextField;
