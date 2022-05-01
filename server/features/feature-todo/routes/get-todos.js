const sqlite = require('../../../services/sqlite')

// NOTE: IMPORTANT! always name the route method with method.
// Because it is used inside init function.

const method = async () => {
    const TodoModel = sqlite.getModel('Todo')
    const result = await TodoModel.handleGetTodos()
    return result
}

module.exports = {
    method
}
