import { Button, Col, Divider, Row, Select, Table, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import {
  addAccounts,
  getAccounts,
  searchAccounts,
} from 'features/feature-account/services/account.service';
import { getCategories } from 'features/feature-category/services/category.service';

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

// const accountData: AccountType[] = [
//   {
//     key: '1',
//     id: '100045708169083',
//     name: 'Lien Phan Kim',
//     email: 'kimlien1962@gmail.com',
//     birthday: '20/10/1962',
//     category: 'Shopping',
//     status: 'Live',
//     friendCount: 20,
//     groupCount: 10,
//     device: 'SGP521',
//     completedAt: '26-04-2022 14:03',
//   },
// ];

const accountRowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: AccountType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  getCheckboxProps: (record: AccountType) => ({
    // disabled: record.name === 'Disabled User', // Column configuration not to be checked
    // name: record.name,
  }),
};

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

const AccountManager = () => {
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
            onChange={(values) =>
              dispatch(searchAccounts({ categoryIds: values }))
            }
          >
            {categories}
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
      <Table
        rowSelection={{
          type: 'checkbox',
          ...{ rowSelection: accountRowSelection },
        }}
        columns={accountColumns}
        dataSource={listAccount}
        pagination={false}
        rowKey="accountId"
      />
    </>
  );
};

export default AccountManager;
