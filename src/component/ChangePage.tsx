import { Table, Row, Col, Divider, Button, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../../assets/css/style.css';
import { useState } from 'react';

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

const groupData = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const accountData: AccountType[] = [
  {
    key: '1',
    id: '100045708169083',
    name: 'Lien Phan Kim',
    email: 'kimlien1962@gmail.com',
    birthday: '20/10/1962',
    category: 'Shopping',
    status: 'Live',
    friendCount: 20,
    groupCount: 10,
    device: 'SGP521',
    completedAt: '26-04-2022 14:03',
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

const accountRowSelection = {
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
  const [fileList, setFileList] = useState([]);
  const [importing, setImporting] = useState(false);
  const handleImport = () => {
    setImporting(true);
  };
  const props = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onRemove: (file) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    beforeUpload: (file) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  const uploadComponent = (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Select File</Button>
    </Upload>
  );

  const children = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    );
  }
  return (
    <>
      <div
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
            <Select
              mode="tags"
              style={{ width: '30%' }}
              placeholder="Tất cả danh mục"
              onChange={(value) => console.log(`selected ${value}`)}
            >
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
              <Select
                defaultValue="a1"
                onChange={(value) => console.log(`selected ${value}`)}
                style={{ width: 200 }}
              >
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
      </div>
    </>
  );
};

export default ChangePage;
