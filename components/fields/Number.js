import React from 'react';
import TextField from './Text';

class NumberField extends TextField {
  selectInputText(element) {
  // element.setSelectionRange won't work for an input of type "number"
    setTimeout(function() { element.select(); }, 10);
  }

  validate(val) {
    return !isNaN(val) && isFinite(val) && super.validate(val);
  }

  processVal(val) {
    return parseFloat(val);
  }

  renderField() {
    return <input
            defaultValue={this.props.value}
            onInput={this.changed}
            onBlur={this.finishEditing}
            ref="input"
            type="number"
            onKeyDown={this.keyDown} />;
  }
}

export default NumberField;
