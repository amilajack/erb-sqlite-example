// TODO: it might be a good practice to keep feature methods defined in this file:
// import ipcRoutes from './ipc-routes'
import { setList } from '../reducers/todo.reducer'

export const exportTodos = () => async () => {
    // TODO: Implement export as JSON functionality
    console.log('export todos')
}

export const getTodos = () => async (dispatch) => {
    const todos = await api_todos.getTodos()
    dispatch(setList(todos))
}

export const addTodo = (val) => async (dispatch) => {
    await api_todos.addTodo(val)
    dispatch(getTodos())
}

export const getTodo = (todoId) => async (dispatch, getState) => {
    const { todos } = getState()
    const todo = todos.list.filter(todo => todo.todo_id === todoId)
    return todo
}

export const updateTodo = (todoId, newVal) => async (dispatch) => {
    await api_todos.updateTodo({ todoId, description: newVal })
    dispatch(getTodos())
}

export const deleteTodo = (todoId) => async (dispatch) => {
    await api_todos.deleteTodo(todoId)
    dispatch(getTodos())
}

export const deleteTodos = () => async (dispatch) => {
    await api_todos.deleteTodos()
    dispatch(getTodos())
}
