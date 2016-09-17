import React from 'react';
import BaseModal from './Base';

class Confirm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      message: '',
      onYes: () => {},
      onNo: () => {}
    }
  }

  render() {
    return <BaseModal isOpen={this.state.open} onRequestClose={this.cancel.bind(this)}>
      <div className="modal-body">{this.state.message}</div>
      <ul className="modal-actions">
        <li onClick={this.cancel.bind(this)}>Cancel</li>
        <li onClick={this.confirm.bind(this)}>OK</li>
      </ul>
    </BaseModal>;
  }

  close() {
    this.setState({
      open: false
    });
  }

  cancel() {
    if (this.state.onNo) {
      this.state.onNo();
    }
    this.close();
  }

  confirm() {
    this.state.onYes();
    this.close();
  }
}

export default Confirm;
