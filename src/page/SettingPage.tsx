import { Row, Col, Divider } from 'antd';
import _ from 'lodash';
import CategoryManager from 'component/CategoryManager';
import FeedFacebookSetting from 'component/FeedFacebookSetting';

const SettingPage = () => {

  return (
    <>
      <FeedFacebookSetting />
      <Row
        style={{
          height: '50%',
          backgroundColor: 'white',
        }}
      >
        <Col span={8} />
        <Col span={8} />
        <Col span={8}>
          <Divider orientation="left" orientationMargin={20}>
            Thông tin Danh mục
          </Divider>
          <div style={{ height: '400px' }}>
            <CategoryManager />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SettingPage;
