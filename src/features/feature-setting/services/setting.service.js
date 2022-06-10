/* eslint-disable no-undef */
// TODO: it might be a good practice to keep feature methods defined in this file:
// import ipcRoutes from './ipc-routes'
import { setSetting, setLoadingGetSetting } from '../reducers/setting.reducer';

export const exportSetting = () => async () => {
  // TODO: Implement export as JSON functionality
  console.log('export accounts');
};

export const saveTmpSetting = (setting) => async (dispatch) => {
  dispatch(saveTmpSetting(setting));
};

export const getSetting = () => async (dispatch) => {
  dispatch(setLoadingGetSetting(true));
  const setting = await api_settings.getSetting();
  dispatch(setSetting(setting));
  dispatch(setLoadingGetSetting(false));
};

export const upsertSetting = (setting) => async (dispatch) => {
  dispatch(setLoadingGetSetting(true));
  await api_settings.upsertSetting(setting);
  dispatch(getSetting());
  dispatch(setLoadingGetSetting(false));
};
