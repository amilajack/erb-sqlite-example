export const initialState = {
  listAccount: [],
  [`isLoading_${SET_LOADING_GET_ACCOUNTS}`]: false,
};

/**
 * Actions
 */

export const SET_LIST = 'setList@accounts';
export const SET_LOADING_GET_ACCOUNTS = 'setLoadingGetAccounts@accounts';

export const setList = (accounts) => ({
  type: SET_LIST,
  payload: { accounts },
});

export const setLoadingGetAccounts = (isLoading) => ({
  type: SET_LOADING_GET_ACCOUNTS,
  payload: { isLoading },
});

/**
 * Handlers
 */
export const actionHandlers = {
  [SET_LOADING_GET_ACCOUNTS]: (state, { payload }) => ({
    ...state,
    [`isLoading_${SET_LOADING_GET_ACCOUNTS}`]: payload.isLoading
  }),
  [SET_LIST]: (state, { payload }) => ({
    ...state,
    listAccount: payload.accounts,
  }),
};

export default (state = initialState, action) => {
  const handler = actionHandlers[action.type];
  return handler ? handler(state, action) : state;
};
