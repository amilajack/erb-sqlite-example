import { Table, Row, Col, Divider, Button, Modal, Select, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../../assets/css/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { getTodos } from 'features/feature-todo/services/todo.service';
import _ from 'lodash';

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

interface CategoryType {
  key: React.Key;
  id: number,
  name: string;
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

const categoryData: CategoryType[] = [
  {
    key: '1',
    id: 1,
    name: 'Hạng mục 1',
  },
  {
    key: '2',
    id: 2,
    name: 'Hạng mục 2',
  },
];

const settingSchema = Yup.object().shape({
  categoryName: Yup.string()
    .max(50, 'Danh mục chỉ có nhiều nhất 50 kí tự')
    .required('Vui lòng nhập tên danh mục'),
});

const SettingPage = () => {
  const { list } = useSelector((state) => _.get(state, 'todos', []));
  console.log('list', list);

  const children = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    );
  }
  const [isModalVisible, setModalVisible] = useState(false);

  const editCategory = (id: number) => {
    console.log(id);
    setModalVisible(true);
  };

  const categoryColumns = [
    {
      title: 'Stt',
      width: '5%',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      width: '85%',
    },
    {
      title: 'Action',
      width: '10%',
      dataIndex: 'id',
      render: (id: number) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <a>
              <EditOutlined onClick={() => editCategory(id)} />
            </a>
          </div>
        );
      },
    },
  ];

  const addCategory = () => {
    setModalVisible(true);
  };

  const initialValues = {
    categoryName: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: settingSchema,
    onSubmit: () => {},
  });

  const handleModalOk = async () => {
    if (formik.errors.categoryName) {
      return;
    }
    // await window.dbStorage.createCategory(formik.values.categoryName);
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    formik.resetForm({ values: { categoryName: '' } });
    setModalVisible(false);
  };

  const fetchCategory = async () => {
    // dispatch(getTodos());
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTodos());
  }, []);

  return (
    <>
      <Row
        style={{
          height: '50%',
          backgroundColor: 'white',
        }}
      >
        <Col span={12} style={{ padding: '10px' }}>
          <Divider orientation="left" orientationMargin={20}>
            Thông tin Danh mục
          </Divider>
          <div style={{ height: '400px' }}>
            <Button
              type="primary"
              style={{ marginBottom: '10px' }}
              onClick={() => addCategory()}
            >
              Thêm
            </Button>
            <Table
              columns={categoryColumns}
              dataSource={categoryData}
              pagination={false}
            />
          </div>
        </Col>
        <Col span={12} />
      </Row>
      <Row
        style={{
          height: '50%',
          backgroundColor: 'white',
        }}
      >
        <Col span={12}>
          <Divider orientation="left" orientationMargin={20}>
            Thông tin Danh mục
          </Divider>
        </Col>
        <Col span={12} />
      </Row>

      <Modal
        title="Danh mục"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <form>
          <Input
            placeholder="Tên danh mục"
            value={formik.values.categoryName}
            maxLength={50}
            onBlur={formik.handleBlur('categoryName')}
            onChange={(e) =>
              formik.setFieldValue('categoryName', e.target.value)
            }
            className={
              formik.touched.categoryName && formik.errors.categoryName
                ? 'validateErrorField'
                : ''
            }
          />
          {formik.touched.categoryName && formik.errors.categoryName && (
            <span className="validateErrorMessage">
              {formik.errors.categoryName}
            </span>
          )}
        </form>
      </Modal>

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
