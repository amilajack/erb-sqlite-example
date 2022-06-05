/**
 * Actions
 */

export const settingActions = {
  SAVE_TMP_SETTING: 'saveTmpSetting@setting',
  SET_TMP_SETTING: 'setTmpSetting@setting',
  SET_SETTING: 'setSetting@setting',
  SET_LOADING_GET_SETTING: 'setLoadingGetSetting@setting',
};

export const initialState = {
  setting: {},
  tmpSetting: {},
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  [`isLoading_${settingActions.SET_LOADING_GET_SETTING}`]: false,
};

export const saveTmpSetting = (key, setting) => ({
  type: settingActions.SAVE_TMP_SETTING,
  payload: { key, setting },
});

export const setTmpSetting = (setting) => ({
  type: settingActions.SET_TMP_SETTING,
  payload: { setting },
});

export const setSetting = (setting) => ({
  type: settingActions.SET_SETTING,
  payload: { setting },
});

export const setLoadingGetSetting = (isLoading) => ({
  type: settingActions.SET_LOADING_GET_SETTING,
  payload: { isLoading },
});

/**
 * Handlers
 */
export const actionHandlers = {
  [settingActions.SET_LOADING_GET_SETTING]: (state, { payload }) => ({
    ...state,
    [`isLoading_${settingActions.SET_LOADING_GET_SETTING}`]: payload.isLoading,
  }),
  [settingActions.SET_SETTING]: (state, { payload }) => ({
    ...state,
    setting: payload.setting,
  }),
  [settingActions.SAVE_TMP_SETTING]: (state, { payload }) => ({
    ...state,
    tmpSetting: {
      ...state.tmpSetting,
      ...{
        [payload.key]: { ...state.tmpSetting[payload.key], ...payload.setting },
      },
    },
  }),
  [settingActions.SET_TMP_SETTING]: (state, { payload }) => ({
    ...state,
    tmpSetting: payload.setting,
  }),
};

export default (state = initialState, action) => {
  const handler = actionHandlers[action.type];
  return handler ? handler(state, action) : state;
};
