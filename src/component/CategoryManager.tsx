import _ from 'lodash';
import { useFormik } from 'formik';
import { EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCategories,
  addCategory,
  updateCategory,
} from 'features/feature-category/services/category.service';
import * as Yup from 'yup';
import { Button, Input, Modal, Table } from 'antd';

interface CategoryType {
  key: React.Key;
  id: number;
  name: string;
}

const settingSchema = Yup.object().shape({
  categoryName: Yup.string()
    .max(50, 'Danh mục chỉ có nhiều nhất 50 kí tự')
    .required('Vui lòng nhập tên danh mục'),
});

const CategoryManager = () => {
  const { listCategory } = useSelector((state) =>
    _.get(state, 'categories', [])
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditedId, setEditedId] = useState(0);
  const dispatch = useDispatch();

  const initialValues = {
    categoryName: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: settingSchema,
    onSubmit: () => {},
  });

  const onEditCategory = (id: number) => {
    setEditedId(id);
    formik.setFieldValue(
      'categoryName',
      _.get(
        _.find(listCategory, (c) => c.categoryId === id),
        'name'
      )
    );
    setModalVisible(true);
  };

  const onAddCategory = () => {
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    const FormikErrors = await formik.validateForm();
    if (FormikErrors.categoryName) {
      return;
    }
    if (isEditedId) {
      dispatch(updateCategory(isEditedId, formik.values.categoryName));
    } else {
      dispatch(addCategory(formik.values.categoryName));
    }
    setEditedId(0);
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    formik.resetForm({ values: { categoryName: '' } });
    setModalVisible(false);
  };

  const categoryColumns = [
    {
      title: 'Stt',
      width: '5%',
      render: (text: string, record: CategoryType, index: number) => {
        return index + 1;
      },
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      width: '85%',
    },
    {
      title: 'Action',
      width: '10%',
      dataIndex: 'categoryId',
      render: (categoryId: number) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <a>
              <EditOutlined onClick={() => onEditCategory(categoryId)} />
            </a>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: '10px' }}
        onClick={() => onAddCategory()}
      >
        Thêm
      </Button>
      <Table
        columns={categoryColumns}
        dataSource={listCategory}
        pagination={false}
        rowKey="categoryId"
      />
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
            className={formik.errors.categoryName ? 'validateErrorField' : ''}
          />
          {formik.errors.categoryName && (
            <span className="validateErrorMessage">
              {formik.errors.categoryName}
            </span>
          )}
        </form>
      </Modal>
    </>
  )
};

export default CategoryManager;
