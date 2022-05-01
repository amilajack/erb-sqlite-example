// hooks
const { IPCROUTER_BEFORE_START } = require('../../services/ipc-router/hooks')
const { SQLITE_BEFORE_START } = require('../../services/sqlite/hooks')
const { FEATURE_NAME } = require('./hooks')
const { routes } = require('./ipc-route.manifest')

// sqlite
const todoModel = require('./models/todo.model')

const register = ({ registerAction, registerHook }) => {
    registerHook(FEATURE_NAME)

    registerAction({
        hook: `${IPCROUTER_BEFORE_START}`,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ options }) => {
            // push the feature routes here
            routes.forEach(route => options.routes.push(route))
        },
    })

    registerAction({
        hook: `${SQLITE_BEFORE_START}/default`,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ options }) => {
            // push the feature models here
            options.models.push(todoModel)
        },
    })
}

module.exports = register
