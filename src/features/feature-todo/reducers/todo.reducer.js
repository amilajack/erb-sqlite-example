export const initialState = {
    list: [],
}

/**
 * Actions
 */

export const SET_LIST = 'setList@todos'

export const setList = (todos) => ({
    type: SET_LIST,
    payload: { todos },
})

/**
 * Handlers
 */

export const actionHandlers = {
    [SET_LIST]: (state, { payload }) => ({
        ...state,
        list: payload.todos,
    }),
}

export default (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}
