/**
 * Actions
 */

export const accountActions = {
  SET_LIST: 'setList@accounts',
  SET_LOADING_GET_ACCOUNTS: 'setLoadingGetAccounts@accounts',
};

export const initialState = {
  listAccount: [],
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  [`isLoading_${accountActions.SET_LOADING_GET_ACCOUNTS}`]: false,
};

export const setList = (accounts) => ({
  type: accountActions.SET_LIST,
  payload: { accounts },
});

export const setLoadingGetAccounts = (isLoading) => ({
  type: accountActions.SET_LOADING_GET_ACCOUNTS,
  payload: { isLoading },
});

/**
 * Handlers
 */
export const actionHandlers = {
  [accountActions.SET_LOADING_GET_ACCOUNTS]: (state, { payload }) => ({
    ...state,
    [`isLoading_${accountActions.SET_LOADING_GET_ACCOUNTS}`]: payload.isLoading,
  }),
  [accountActions.SET_LIST]: (state, { payload }) => ({
    ...state,
    listAccount: payload.accounts,
  }),
};

export default (state = initialState, action) => {
  const handler = actionHandlers[action.type];
  return handler ? handler(state, action) : state;
};
