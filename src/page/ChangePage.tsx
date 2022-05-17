import _ from 'lodash';
import '../../assets/css/style.css';
import { Row, Col, Divider, Button } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import AccountManager from 'component/AccountManager';
import DeviceManager from 'component/DeviceManager';
import DeviceAction from 'functions/DeviceAction';

const ChangePage = () => {
  return (
    <>
      <div
        style={{
          minHeight: '200px',
          maxHeight: '500px',
          overflow: 'auto',
          backgroundColor: 'white',
        }}
      >
        <AccountManager />
      </div>
      <div
        style={{
          backgroundColor: 'white',
        }}
      >
        <Row
          style={{
            paddingRight: '20px',
            paddingLeft: '20px',
            paddingBottom: '20px',
            display: 'flex',
            // justifyContent: 'end',
          }}
        >
          <Col span={12}>
            <Divider orientation="left" orientationMargin={20}>
              Action
            </Divider>
            <Button
              type="primary"
              className="btnSuccess"
              icon={<CaretRightOutlined />}
            >
              Start
            </Button>
            <Button
              type="primary"
              className="btnSuccess"
              onClick={() =>
                DeviceAction.backupAppMulti(
                  '1c591614840d7ece',
                  ['com.facebook.katana'],
                  'bbirdenkhilde@gmail.com'
                )
              }
            >
              Backup Facebook
            </Button>
          </Col>

          <Col span={12}>
            <DeviceManager />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChangePage;
