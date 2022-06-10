import _ from 'lodash';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Input,
  InputNumber,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
  Table,
  Upload,
} from 'antd';
import {
  UploadOutlined,
  HistoryOutlined,
  TeamOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAccounts,
  getAccounts,
  searchAccounts,
} from 'features/feature-account/services/account.service';
import { getCategories } from 'features/feature-category/services/category.service';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import CommonFunc from 'common/common';

const { Option } = Select;

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

const LIST_ACCOUNT_INIT: AccountType[] = [];

const accountColumns = [
  {
    title: 'Stt',
    width: '10%',
    render: (text: string, account: AccountType, index: number) => (
      <span>{index + 1}</span>
    ),
  },
  {
    title: 'Local',
    dataIndex: 'local',
    width: '10%',
  },
  {
    title: 'Uid',
    dataIndex: 'uid',
    width: '15%',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: 'Username',
    dataIndex: 'username',
    width: '15%',
  },
  {
    title: 'Password',
    dataIndex: 'password',
    width: '15%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: '20%',
  },
  {
    title: 'Pass mail',
    dataIndex: 'passMail',
    width: '15%',
  },
  {
    title: 'Proxy',
    dataIndex: 'proxy',
    width: '10%',
  },
  {
    title: 'birthday',
    dataIndex: 'birthday',
    width: '10%',
  },
  {
    title: 'Friends',
    dataIndex: 'friends',
    width: '10%',
  },
  {
    title: 'Groups',
    dataIndex: 'groups',
    width: '10%',
  },
  {
    title: 'Token',
    dataIndex: 'token',
    width: '10%',
  },
  {
    title: 'Cookie',
    dataIndex: 'cookie',
    width: '10%',
  },
  {
    title: 'Auth',
    dataIndex: 'auth',
    width: '10%',
  },
  {
    title: 'BU.IMG',
    dataIndex: 'buImg',
    width: '10%',
  },
  {
    title: 'BU.CM',
    dataIndex: 'buComment',
    width: '10%',
  },
  {
    title: 'VIA',
    dataIndex: 'isVia',
    width: '10%',
  },
  {
    title: 'Login',
    dataIndex: 'isLogin',
    width: '10%',
  },
  {
    title: 'Run',
    dataIndex: 'isRun',
    width: '10%',
  },
  {
    title: 'Backup time',
    dataIndex: 'backupTime',
    width: '15%',
  },
  {
    title: 'Inserted time',
    dataIndex: 'insertedTime',
    width: '15%',
  },
  {
    title: 'Message',
    dataIndex: 'message',
    width: '30%',
  },
];

const readAccountCsv = (pathFile: string) => {
  return new Promise((resolve, reject) => {
    Papa.parse(pathFile, {
      header: true,
      skipEmptyLines: true,
      error(error: Error) {
        reject(error);
      },
      complete(results) {
        resolve(results.data);
      },
    });
  });
};

interface AccountManagerContentProps {
  setAccountSelected: (accounts: AccountType[]) => void;
}

const AccountManagerContent: React.FC<AccountManagerContentProps> = ({
  setAccountSelected,
}) => {
  const { listCategory } = useSelector((state) =>
    _.get(state, 'categories', [])
  );
  const categories = listCategory.map(
    (c: { categoryId: number; name: string }) => (
      <Option key={c.categoryId}>{c.name}</Option>
    )
  );
  categories.unshift(<Option key=""> </Option>);

  const { listAccount } = useSelector((state) => _.get(state, 'accounts', []));

  const [fileList, setFileList] = useState([]);
  const [importing, setImporting] = useState(false);
  const [categoryImportSelected, setCategoryImportSelected] = useState('');
  const [categoriesSearch, setCategoriesSearch] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [accountStatusSearch, setAccountStatusSearch] = useState('');

  const searchAccountQuery = useMemo(() => {
    return {
      categories: categoriesSearch,
      name: nameSearch,
    };
  }, [categoriesSearch, nameSearch]);

  const dispatch = useDispatch();

  const executeReadCsvFile = async (pathFile: string) => {
    const accounts = await readAccountCsv(pathFile);
    // @ts-ignore
    const accountsAdded = accounts.map((ac: AccountType) => {
      return { ...ac, ...{ categoryId: categoryImportSelected } };
    });
    dispatch(addAccounts(accountsAdded));
    setImporting(false);
    setFileList([]);
    setCategoryImportSelected('');
  };

  const handleImport = () => {
    setImporting(true);
    executeReadCsvFile(fileList[0]);
  };

  const accountRowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: AccountType[]) => {
      setAccountSelected(selectedRows);
    },
    getCheckboxProps: (record: AccountType) => ({
      // disabled: record.name === 'Disabled User', // Column configuration not to be checked
      // name: record.name,
    }),
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
    accept: '.csv',
  };

  const uploadComponent = (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Upload {...props}>
      <Button disabled={fileList.length === 1} icon={<UploadOutlined />}>
        Select File
      </Button>
    </Upload>
  );

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getAccounts());
  }, []);

  return (
    <>
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
            onChange={(values) => {
              setCategoriesSearch(values);
              dispatch(
                searchAccounts({
                  ...searchAccountQuery,
                  ...{ categories: values },
                })
              );
            }}
          >
            {categories}
          </Select>
          <Input.Search
            allowClear
            style={{ width: '30%', marginLeft: '15px' }}
            placeholder="Nhập thông tin tài khoản muốn tìm"
            onChange={(e) => {
              setNameSearch(e.target.value);
            }}
            onSearch={(value) => {
              dispatch(
                searchAccounts({ ...searchAccountQuery, ...{ name: value } })
              );
            }}
          />
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
              defaultValue=""
              value={categoryImportSelected}
              onChange={(value) => setCategoryImportSelected(value)}
              style={{ width: 250, height: '35px' }}
            >
              {categories}
            </Select>
            <Button
              type="primary"
              onClick={handleImport}
              disabled={fileList.length === 0 || categoryImportSelected === ''}
              loading={importing}
              style={{ marginLeft: 30 }}
            >
              {importing ? 'Importing...' : 'Start Import'}
            </Button>
            {/* <Button icon={<FolderOpenOutlined />}>Open folder</Button> */}
          </Row>
        </Col>
      </Row>
      <Row
        style={{
          paddingRight: '20px',
          paddingLeft: '20px',
          paddingBottom: '20px',
          display: 'flex',
          justifyContent: 'start',
        }}
      >
        <Col>
          <span className="label-setting" style={{ marginRight: '15px' }}>
            Find:
          </span>
        </Col>
        <Col>
          <Radio.Group
            defaultValue={accountStatusSearch}
            onChange={(e: RadioChangeEvent) =>
              setAccountStatusSearch(e.target.value)
            }
          >
            <Space>
              <Radio value="all">All</Radio>
              <Radio value="worker">Worker</Radio>
              <Radio value="not_login">Not login</Radio>
              <Radio value="checkpoint">Checkpoint</Radio>
              <Radio value="disable">Disable</Radio>
            </Space>
          </Radio.Group>
        </Col>
      </Row>
      <div
        style={{
          minHeight: '200px',
          maxHeight: '1000px',
          overflow: 'auto',
        }}
      >
        <Table
          rowSelection={{
            type: 'checkbox',
            ...accountRowSelection,
          }}
          columns={accountColumns}
          dataSource={listAccount}
          pagination={false}
          rowKey="accountId"
          scroll={{ y: 700, x: '150vw' }}
        />
      </div>
    </>
  );
};

type Props = {
  isShow: boolean;
  setModalPage: (page: string) => void;
};

const AccountManager: React.FC<Props> = ({ isShow, setModalPage }) => {
  const [isShowSettingModal, setShowSettingModal] = useState(false);
  const [accountSelected, setAccountSelected] = useState(LIST_ACCOUNT_INIT);
  return (
    <Modal
      title="Account Manager"
      visible={isShow}
      width="100%"
      destroyOnClose
      onOk={() => {
        setModalPage('');
      }}
      onCancel={() => {
        setModalPage('');
      }}
      footer={[
        <Button
          key="auto_backup"
          type="primary"
          onClick={() => setShowSettingModal(true)}
          icon={<HistoryOutlined />}
        >
          Auto Backup
        </Button>,
        <Button
          onClick={() =>
            CommonFunc.showModalConfirm(
              'Infomation',
              'Tính năng này sử dụng token & cookie để sao lưu, có thể dẫn đến checkpoint tài khoản. Bạn có muốn tiếp tục không?'
            )
          }
          key="bu_group"
          type="primary"
          icon={<HistoryOutlined />}
        >
          BU Group
        </Button>,
        <Button
          onClick={() =>
            CommonFunc.showModalConfirm(
              'Infomation',
              'Tính năng này sử dụng token & cookie để sao lưu, có thể dẫn đến checkpoint tài khoản. Bạn có muốn tiếp tục không?'
            )
          }
          key="bu_photos"
          type="primary"
          icon={<HistoryOutlined />}
        >
          BU Photos
        </Button>,
        <Button
          onClick={() =>
            CommonFunc.showModalConfirm(
              'Infomation',
              'Tính năng này sử dụng token & cookie để sao lưu, có thể dẫn đến checkpoint tài khoản. Bạn có muốn tiếp tục không?'
            )
          }
          key="bu_friends"
          type="primary"
          icon={<HistoryOutlined />}
        >
          BU Friends
        </Button>,
        <Button
          onClick={() =>
            CommonFunc.showModalConfirm(
              'Infomation',
              'Tính năng này sử dụng token & cookie để sao lưu, có thể dẫn đến checkpoint tài khoản. Bạn có muốn tiếp tục không?'
            )
          }
          key="get_full_info"
          type="primary"
          icon={<HistoryOutlined />}
        >
          Get full info
        </Button>,
        <Button
          onClick={() => {
            if (_.isEmpty(accountSelected)) {
              CommonFunc.showModalInfo('Information', 'Please select account');
            }
          }}
          key="check_live"
          type="primary"
          icon={<TeamOutlined />}
        >
          Check live
        </Button>,
      ]}
    >
      <AccountManagerContent setAccountSelected={setAccountSelected} />
      <Modal
        title="Backup accounts setting"
        visible={isShowSettingModal}
        width="50%"
        centered
        onOk={() => setShowSettingModal(false)}
        onCancel={() => setShowSettingModal(false)}
        footer={[
          <Button
            onClick={() => setShowSettingModal(false)}
            key="cancel"
            type="default"
          >
            Cancel
          </Button>,
          <Button
            onClick={() => setShowSettingModal(false)}
            key="start"
            type="primary"
            icon={<CaretRightOutlined />}
          >
            Start
          </Button>,
        ]}
      >
        <Row className="row-per-setting">
          <Col span={2}>
            <span className="label-setting">Actions</span>
          </Col>
          <Col>
            <Checkbox
              checked
              onChange={(e: CheckboxChangeEvent) =>
                // setInteractFollowFanPg(e.target.checked)
                console.log('e.target.checked', e.target.checked)
              }
            >
              Get full info
            </Checkbox>
          </Col>
          <Col>
            <Checkbox
              checked
              onChange={(e: CheckboxChangeEvent) =>
                // setInteractRandomAct(e.target.checked)
                console.log('e.target.checked', e.target.checked)
              }
            >
              Backup groups
            </Checkbox>
          </Col>
          <Col>
            <Checkbox
              checked
              onChange={(e: CheckboxChangeEvent) =>
                // setInteractRandomAct(e.target.checked)
                console.log('e.target.checked', e.target.checked)
              }
            >
              Backup friends
            </Checkbox>
          </Col>
          <Col>
            <Checkbox
              checked
              onChange={(e: CheckboxChangeEvent) =>
                // setInteractRandomAct(e.target.checked)
                console.log('e.target.checked', e.target.checked)
              }
            >
              Backup photos
            </Checkbox>
          </Col>
          <Col>
            <Checkbox
              checked
              onChange={(e: CheckboxChangeEvent) =>
                // setInteractRandomAct(e.target.checked)
                console.log('e.target.checked', e.target.checked)
              }
            >
              Backup photos
            </Checkbox>
          </Col>
        </Row>
        <Row className="row-per-setting">
          <Col span={2}>
            <span className="label-setting">Thread</span>
          </Col>
          <Col>
            <InputNumber
              min={1}
              max={100000}
              defaultValue={1}
              onChange={(value) => console.log(value)}
            />
          </Col>
        </Row>
      </Modal>
    </Modal>
  );
};

export default AccountManager;
