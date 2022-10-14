import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';

const CompleteModal = props => {
  return (
    <Modal
      headerStyle={{backgroundColor:'green'}}
      onCancel={props.onClear}
      header="สำเร็จ"
      show={props.done}
      footer={<Button done onClick={props.onClear}>ตกลง</Button>}
    >
      <p>{props.text}</p>
    </Modal>
  );
};

export default CompleteModal;
