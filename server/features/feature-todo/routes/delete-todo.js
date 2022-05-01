const sqlite = require('../../../services/sqlite')

// NOTE: IMPORTANT! always name the route method with method.
// Because it is used inside init function.

const method = async (todoId) => {
    const TodoModel = sqlite.getModel('Todo')
    const result = await TodoModel.handleDeleteTodo(todoId)
    return result
}

module.exports = {
    method
}
