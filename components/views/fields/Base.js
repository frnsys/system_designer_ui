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
  onFinish: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  validate: React.PropTypes.func,
  className: React.PropTypes.string
};

export default BaseField;
