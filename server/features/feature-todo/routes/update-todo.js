const sqlite = require('../../../services/sqlite')

// NOTE: IMPORTANT! always name the route method with method.
// Because it is used inside init function.

const method = async (args) => {
    const TodoModel = sqlite.getModel('Todo')
    const result = await TodoModel.handleUpdateTodo(args)
    return result
}

module.exports = {
    method
}
