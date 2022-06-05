import _ from 'lodash';
import { Button, Divider, Table, Modal, Row, Space, Menu, Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import { SettingOutlined, ReloadOutlined, CaretRightOutlined } from '@ant-design/icons';
import DeviceInfoAction from 'functions/DeviceInfoAction';
import SettingsManager from './SettingsManager';
import ScriptInteractiveSettingForRun from './settings_component/settings_sub_component/ScriptInteractiveSettingForRun';

interface DeviceType {
  key: React.Key;
  device: string;
  serial: string;
  report: string;
  status: string;
  setting: string,
  proxy: string;
  oldInfo: any;
  newInfo: any;
}

const DeviceManager = () => {
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
      width: '20%',
    },
    {
      title: 'Setting',
      dataIndex: 'setting',
      width: '20%',
      render: (text: string, device: DeviceType) => {
        let settingStr = '';
        switch (text) {
          case 'script_interactive':
            settingStr = 'Kịch bản tương tác';
            break;
          default:
            break;
        }
        return (<div><SettingOutlined /><span style={{marginLeft: '5px'}}>{settingStr}</span></div>);
      },
    },
    {
      title: 'Action',
      width: '25%',
    },
  ];

  const devicesInit: DeviceType[] = [];
  const stringArrInit: string[] = [];
  const [devices, setDevices] = useState(devicesInit);
  const [devicesSelectedSerial, setDevicesSelectederial] = useState(stringArrInit);
  const [settingChosen, setSettingChosen] = useState('');
  const [isShowSettingForScriptInteractive, setShowSettingForScriptInteractive] = useState(false);
  const [isDisableStartBtn, setDisableStartBtn] = useState(true);

  const menu = (
    <Menu
        items={[
          {
            key: 'script_interactive',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={() => {
                setSettingChosen('script_interactive')
                setShowSettingForScriptInteractive(true)
              }}>
                Kịch bản tương tác
              </a>
            ),
          },
          {
            key: 'post_interactive',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={() => setSettingChosen('post_interactive')}>
                Tương tác bài viết (like, share, comment...)
              </a>
            ),
          },
          {
            key: 'reel_interactive',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={() => setSettingChosen('reel_interactive')}>
                Tương tác thước phim (Reels)
              </a>
            ),
          },
        ]}
      />
  );

  const updateSettingDevice = (settingKey: string) => {
    const devicesUpdated = devices.slice().map(d => {
      if (devicesSelectedSerial.includes(d.serial) && _.isEmpty(d.setting)) {
        Object.assign(d, {setting: settingKey});
      }
      return d;
    });
    setDevices(devicesUpdated);
  }

  const deviceRowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DeviceType[]) => {
      setDevicesSelectederial(selectedRows.slice().map((sd) => sd.serial));
    },
    getCheckboxProps: (record: DeviceType) => ({
      // console.log('record', record);
    }),
  };

  const loadDevices = async () => {
    const deviceSerials: string[] = await DeviceInfoAction.getSerials();
    const serials: string[] = devices
      .slice()
      .map((s) => _.get(s, 'serial'));
    const devicesTmp: DeviceType[] = devices.slice();
    for (const deviceSerial of deviceSerials) {
      if (!serials.includes(deviceSerial)) {
        devicesTmp.push({
          key: deviceSerial,
          device: '',
          serial: deviceSerial,
          report: '',
          status: '',
          setting: '',
          proxy: await DeviceInfoAction.getDeviceProxy(deviceSerial),
          oldInfo: await DeviceInfoAction.getWinInfo(deviceSerial),
          newInfo: {},
        });
      }
    }
    if (devicesTmp.length !== devices.length) {
      setDevices(devicesTmp);
    }
  };

  useEffect(() => {
    setDisableStartBtn(!_.find(devicesSelectedSerial, (serial) => {
      const deviceWithoutSetting = _.find(devices, d => serial === d.serial && _.isEmpty(d.setting));
      return !!deviceWithoutSetting;
    }));
  }, [devicesSelectedSerial, devices]);

  return (
    <>
      <Divider orientation="left" orientationMargin={20}>
        Thông tin Device
      </Divider>
      <Row
        style={{
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
        <Space wrap>
          <Button onClick={() => loadDevices()} type="primary" icon={<ReloadOutlined />}>
            Load device
          </Button>
          <SettingsManager />
          <Dropdown overlay={menu} placement="bottomLeft" arrow={{ pointAtCenter: true }} trigger={['click']} disabled={isDisableStartBtn}>
            <Button type="primary" icon={<CaretRightOutlined />}>
              Start
            </Button>
          </Dropdown>
        </Space>
      </Row>
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
            ...deviceRowSelection,
          }}
          columns={deviceColumns}
          dataSource={devices}
          pagination={false}
        />
      </div>
      <Modal
        title="Chọn kịch bản tương tác"
        visible={isShowSettingForScriptInteractive}
        width="50%"
        onOk={() => {
          updateSettingDevice(settingChosen);
          setShowSettingForScriptInteractive(false);
        }}
        onCancel={() => setShowSettingForScriptInteractive(false)}
      >
        <ScriptInteractiveSettingForRun />
      </Modal>
    </>
  );
};

export default DeviceManager;
