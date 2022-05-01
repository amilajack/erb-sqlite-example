const sqlite = require('../../../services/sqlite')

// NOTE: IMPORTANT! always name the route method with method.
// Because it is used inside init function.

// const method = async () => {
//     return console.log('pong pong')
//     const TodoModel = sqlite.getModel('Todo')
//     const result = await TodoModel.handleDeleteTodos()
//     return result
// }
const method = async () => {
    // return 'pong pong'
    const TodoModel = sqlite.getModel('Todo')
    const result = await TodoModel.handleDeleteTodos()
    return result
}

module.exports = {
    method
}
