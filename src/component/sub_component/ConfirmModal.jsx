import { Modal } from 'antd';
import React, { useState } from 'react';

type Props = {
  message: string,
  visible: boolean,
  callback: () => void,
};

const ConfirmModal: React.FC<Props> = ({ message, visible, callback }) => {
  const [isShowModal, setShowModal] = useState(visible);
  return (
    <Modal
      title="Modal"
      visible={isShowModal}
      onOk={() => {
        callback();
        setShowModal(false);
      }}
      onCancel={() => setShowModal(false)}
      okText="OK"
      cancelText="Cancel"
    >
      <span>{message}</span>
    </Modal>
  );
};

export default ConfirmModal;
