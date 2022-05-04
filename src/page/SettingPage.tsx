import { Table, Row, Col, Divider, Button, Modal, Select, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../../assets/css/style.css';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import CategoryManager from 'component/CategoryManager';
import FeedFacebookSetting from 'component/FeedFacebookSetting';

const { Option } = Select;

const accountColumns = [
  {
    title: 'Stt',
    width: '5%',
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    width: '10%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: '18%',
  },
  {
    title: 'birthday',
    dataIndex: 'birthday',
    width: '10%',
  },
  {
    title: 'Danh mục',
    dataIndex: 'category',
    width: '10%',
  },
  {
    title: 'T/thái',
    dataIndex: 'status',
    width: '7%',
  },
  {
    title: 'friendCount',
    dataIndex: 'friendCount',
    width: '10%',
  },
  {
    title: 'groupCount',
    dataIndex: 'groupCount',
    width: '10%',
  },
  {
    title: 'device',
    dataIndex: 'device',
    width: '10%',
  },
  {
    title: 'completedAt',
    dataIndex: 'completedAt',
    width: '10%',
  },
];

interface AccountType {
  key: React.Key;
  id: string;
  name: string;
  email: string;
  birthday: string;
  category: string;
  status: string;
  friendCount: number;
  groupCount: number;
  device: string;
  completedAt: string;
}

const SettingPage = () => {

  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  }

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
          <div style={{height: '400px'}}>
            <CategoryManager />
          </div>
        </Col>
      </Row>

      {/* <div
        style={{
          height: '700px',
          overflow: 'auto',
          backgroundColor: 'white',
        }}
      >
        <Divider orientation="left" orientationMargin={20}>
          Thông tin Acccount
        </Divider>
        <Row
          style={{
            paddingRight: '20px',
            paddingLeft: '20px',
            paddingBottom: '20px',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Col span={12}>
            <Select mode="tags" style={{ width: '30%' }} placeholder="Tất cả danh mục" onChange={(value) => console.log(`selected ${value}`)}>
              {children}
            </Select>
          </Col>
          <Col span={12}>
            <Row
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              {uploadComponent}
              <Select defaultValue="a1" onChange={(value) => console.log(`selected ${value}`)} style={{ width: 200 }}>
                {children}
              </Select>
              <Button
                type="primary"
                onClick={handleImport}
                disabled={fileList.length === 0}
                loading={importing}
                style={{ marginLeft: 30 }}
              >
                {importing ? 'Importing...' : 'Start Import'}
              </Button>
            </Row>
          </Col>
        </Row>
        <Table
          rowSelection={{
            type: 'checkbox',
            ...{ rowSelection: accountRowSelection },
          }}
          columns={accountColumns}
          dataSource={accountData}
          pagination={false}
        />
      </div>
      <div
        style={{
          backgroundColor: 'white',
        }}
      >
        <Row>
          <Col span={12}>
            <Divider orientation="left" orientationMargin={20}>
              Config Account
            </Divider>
          </Col>

          <Col span={12}>
            <Divider orientation="left" orientationMargin={20}>
              Thông tin Device
            </Divider>
            <div
              style={{
                height: '400px',
                overflow: 'auto',
                backgroundColor: 'white',
              }}
            >
              <Table
                rowSelection={{
                  type: 'checkbox',
                  ...{ rowSelection: deviceRowSelection },
                }}
                columns={deviceColumns}
                dataSource={deviceData}
                pagination={false}
              />
            </div>
            <div
              style={{
                marginTop: '10px',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              <Button type="primary">Load device</Button>
            </div>
          </Col>
        </Row>
      </div> */}
    </>
  );
};

export default SettingPage;
