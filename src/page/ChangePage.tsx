import { Table, Row, Col, Divider, Button, Upload, Select, Checkbox } from 'antd';
import '../../assets/css/style.css';
import { useState } from 'react';
import AccountManager from 'component/AccountManager';
import { Loading } from 'component/Loading';

const deviceColumns = [
  {
    title: 'Device',
    dataIndex: 'device',
    width: '10%',
  },
  {
    title: 'Serial',
    dataIndex: 'serial',
    width: '15%',
  },
  {
    title: 'Report',
    dataIndex: 'report',
    width: '10%',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: '30%',
  },
  {
    title: 'Action',
    width: '35%',
  },
];

interface DeviceType {
  key: React.Key;
  device: string;
  serial: string;
  report: string;
  status: string;
}

const deviceData: DeviceType[] = [
  {
    key: '1',
    device: 'SGP521',
    serial: '23a178611a027ece',
    report: '0 / 0',
    status: '10:12: Hoàn thành',
  },
  {
    key: '2',
    device: 'SGP522',
    serial: '23a178611a027ecf',
    report: '0 / 0',
    status: '10:13: Hoàn thành',
  },
  {
    key: '3',
    device: 'SGP523',
    serial: '23a178611a027ecg',
    report: '0 / 0',
    status: '10:14: Hoàn thành',
  },
  {
    key: '4',
    device: 'SGP523',
    serial: '23a178611a027ech',
    report: '0 / 0',
    status: '10:15: Hoàn thành',
  },
];

const deviceRowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DeviceType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  getCheckboxProps: (record: DeviceType) => ({
    // disabled: record.name === 'Disabled User', // Column configuration not to be checked
    // name: record.name,
  }),
};

const ChangePage = () => {
  return (
    <>
      {/* <Loading isLoading={isLoading} /> */}
      <div
        style={{
          height: '700px',
          overflow: 'auto',
          backgroundColor: 'white',
        }}
      >
        <AccountManager/>
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
      </div>
    </>
  );
};

export default ChangePage;
