import React from 'react';
import ReactDOM from 'react-dom';
import BaseField from './Base';
import { bindHandlers } from '../../Util';

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
    return val.length > 0 && super.validate(val);
  }

  finishEditing() {
    let val = ReactDOM.findDOMNode(this.refs.input).value,
        valid = this.validate(val);
    this.setState({invalid: !valid});
    if(valid && this.props.value !== val) {
      this.commit(val);
    }
    this.cancelEditing();
  }

  cancelEditing() {
    this.setState({editing: false, invalid: false});
  }

  changed() {
    if (this.props.onChange) {
      let val = ReactDOM.findDOMNode(this.refs.input).value,
          valid = this.validate(val);
      this.setState({invalid: !valid});
      if(valid && this.props.value !== val) {
        let update = {};
        update[this.props.name] = val;
        this.props.onChange(update);
      }
    }
  }

  commit(val) {
    if(!this.state.invalid) {
      let update = {};
      update[this.props.name] = val;
      this.props.onFinish(update);
    }
  }

  renderField() {
    return <input
            className={this.className}
            defaultValue={this.props.value}
            onInput={this.changed}
            onBlur={this.finishEditing}
            ref="input"
            onKeyDown={this.keyDown} />;
  }

  renderValue() {
    return <span
      tabIndex="0"
      className={this.className}
      onFocus={this.startEditing}
      onClick={this.startEditing}>{this.props.value}</span>;
  }

  render() {
    return this.state.editing ? this.renderField() : this.renderValue();
  }
}

export default TextField;
