import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const showModalConfirm = (
  title: string,
  content: string,
  onOk = () => console.log('onOk'),
  onCancel = () => console.log('onCancel')
) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText: 'OK',
    cancelText: 'Cancel',
    onOk,
    onCancel,
    centered: true,
  });
};

const showModalInfo = (
  title: string,
  content: string,
  onOk = () => console.log('onOk')
) => {
  Modal.info({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText: 'OK',
    onOk,
    centered: true,
  });
};

const CommonFunc = {
  isLoading: (state: any, actions: any) => {
    return !!Object.keys(actions).find(
      (key) =>
        !!Object.keys(state).find(
          (rd) => state[rd][`isLoading_${actions[key]}`] === true
        )
    );
  },
  showModalConfirm,
  showModalInfo,
};

export default CommonFunc;
