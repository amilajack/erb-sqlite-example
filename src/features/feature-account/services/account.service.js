/* eslint-disable no-undef */
// TODO: it might be a good practice to keep feature methods defined in this file:
// import ipcRoutes from './ipc-routes'
import { setList, setLoadingGetAccounts } from '../reducers/account.reducer';

export const exportAccounts = () => async () => {
  // TODO: Implement export as JSON functionality
  console.log('export accounts');
};

export const getAccounts = () => async (dispatch) => {
  dispatch(setLoadingGetAccounts(true));
  const accounts = await api_accounts.getAccounts();
  dispatch(setList(accounts));
  dispatch(setLoadingGetAccounts(false));
};

export const addAccounts = (accounts) => async (dispatch) => {
  dispatch(setLoadingGetAccounts(true));
  await api_accounts.addAccounts(accounts);
  dispatch(getAccounts());
  dispatch(setLoadingGetAccounts(false));
};

export const searchAccounts = (searchQuery) => async (dispatch) => {
  dispatch(setLoadingGetAccounts(true));
  const accounts = await api_accounts.getAccounts(searchQuery);
  dispatch(setList(accounts));
  dispatch(setLoadingGetAccounts(false));
};
