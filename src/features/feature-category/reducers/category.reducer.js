export const initialState = {
  listCategory: [],
};

/**
 * Actions
 */
export const categoryActions = {
  SET_LIST: 'setList@categories',
};

export const setList = (categories) => ({
  type: categoryActions.SET_LIST,
  payload: { categories },
});

/**
 * Handlers
 */
export const actionHandlers = {
  [categoryActions.SET_LIST]: (state, { payload }) => ({
    ...state,
    listCategory: payload.categories,
  }),
};

export default (state = initialState, action) => {
  const handler = actionHandlers[action.type];
  return handler ? handler(state, action) : state;
};
