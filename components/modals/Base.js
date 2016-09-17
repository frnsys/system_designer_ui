import React from 'react';
import Modal from 'react-modal';

class BaseModal extends Modal {}

BaseModal.defaultProps = {
  style: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(27, 44, 237, 0.7)',
      zIndex: 10
    },
    content: {
      position: 'static',
      margin: '4em auto',
      border: 'none',
      background: '#f5f5f5',
      padding: '2em 2em 0 2em',
      width: '18em'
    }
  }
};

export default BaseModal;
