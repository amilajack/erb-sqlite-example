import _ from 'lodash';
import '../../assets/css/style.css';
import { Row, Col } from 'antd';
import DeviceManager from 'component/DeviceManager';
import AccountList from 'component/settings_component/AccountList';

const ChangePage = () => {
  console.log('ChangePage');
  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
        }}
      >
        <AccountList />
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
          {/* <Col span={12}>
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
          </Col> */}

          <Col span={24}>
            <DeviceManager />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChangePage;
