import _ from 'lodash';
import { Button, Divider, Table } from 'antd';
import { useEffect, useState } from 'react';
import useInterval from 'use-interval';
import DeviceInfoUtil from 'utils/DeviceInfoUtil';

interface DeviceType {
  key: React.Key;
  device: string;
  serial: string;
  report: string;
  status: string;
  proxy: string;
  oldInfo: any;
  newInfo: any;
}

const deviceColumns = [
  {
    title: 'Device',
    dataIndex: 'device',
    width: '10%',
    render: (text: string, device: DeviceType) => {
      return (
        _.get(device, 'oldInfo.win_name') ||
        _.get(device, 'newInfo.model') ||
        _.get(device, 'oldInfo.model')
      );
    },
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

const DeviceManager = () => {
  const devicesInit: DeviceType[] = [];
  const [devices, setDevices] = useState(devicesInit);

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

  useInterval(async () => {
    const deviceSerials: string[] = await DeviceInfoUtil.getSerials();
    const deviceSerialsTmp: string[] = devices
      .slice()
      .map((s) => _.get(s, 'serial'));
    const devicesTmp: DeviceType[] = devices.slice();
    deviceSerials.forEach(async (s) => {
      if (!deviceSerialsTmp.includes(s)) {
        devicesTmp.push({
          key: s,
          device: '',
          serial: s,
          report: '',
          status: '',
          proxy: await DeviceInfoUtil.getDeviceProxy(s),
          oldInfo: await DeviceInfoUtil.getWinInfo(s),
          newInfo: {},
        });
      }
    });
    setDevices(devicesTmp);
  }, 5000);

  useEffect(() => {}, []);

  return (
    <>
      <Divider orientation="left" orientationMargin={20}>
        Thông tin Device
      </Divider>
      <div
        style={{
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
        <Button type="primary">Load device</Button>
      </div>
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
          dataSource={devices}
          pagination={false}
        />
      </div>
    </>
  );
};

export default DeviceManager;
