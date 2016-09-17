import React from 'react';

class BaseField extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false,
      invalid: false
    };
  }

  validate(val) {
    return this.props.validate ? this.props.validate(val) : true;
  }
}

BaseField.propTypes = {
  value: React.PropTypes.any.isRequired,
  name: React.PropTypes.string.isRequired,
  onFinish: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func,
  validate: React.PropTypes.func
};

export default BaseField;
