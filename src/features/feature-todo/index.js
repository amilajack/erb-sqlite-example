import todoReducer from './reducers/todo.reducer'
import * as todoService from './services/todo.service'
// import todoListener from './listeners/todo.listener'

export const reducers = {
    todos: todoReducer,
}

export const services = [todoService]

export const listeners = [
    // todoListener,
]
