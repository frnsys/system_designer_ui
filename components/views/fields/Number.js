import React from 'react';
import TextField from './Text';

class NumberField extends TextField {
  selectInputText(element) {
  // element.setSelectionRange won't work for an input of type "number"
    setTimeout(function() { element.select(); }, 10);
  }

  renderField() {
    return <input
            className={this.className}
            defaultValue={this.props.value}
            onInput={this.textChanged}
            onBlur={this.finishEditing}
            ref="input"
            type="number"
            onKeyDown={this.keyDown} />;
  }
}

export default NumberField;
