/* eslint-disable no-undef */
// TODO: it might be a good practice to keep feature methods defined in this file:
// import ipcRoutes from './ipc-routes'
import { setList } from '../reducers/category.reducer';

export const exportCategories = () => async () => {
  // TODO: Implement export as JSON functionality
  console.log('export todos');
};

export const getCategories = () => async (dispatch) => {
  const catergories = await api_categories.getCategories();
  dispatch(setList(catergories));
};

export const addCategory = (val) => async (dispatch) => {
  await api_categories.addCategory(val);
  dispatch(getCategories());
};

export const updateCategory = (categoryId, newVal) => async (dispatch) => {
  await api_categories.updateCategory({ categoryId, name: newVal });
  dispatch(getCategories());
};
