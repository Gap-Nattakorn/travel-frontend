import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';

const ErrorModal = props => {
  return (
    <Modal
      headerStyle={{backgroundColor:'red'}}
      onCancel={props.onClear}
      header="มีข้อผิดพลาด"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>ตกลง</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
