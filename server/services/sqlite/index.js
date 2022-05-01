const connectionHandler = require('./connection-handler')
const { SERVICE, INIT_SERVICE, START_SERVICE } = require('@forrestjs/hooks')
const init = require('./init')
const start = require('./start')
const { SQLITE_BEFORE_INIT, SQLITE_BEFORE_START } = require('./hooks')

// used to execute raw sql queries
const query = (conn, q, s) => {
    connectionHandler.get(conn).handler.query(q, s)
}

const listen = (conn, channel, fn) =>
    connectionHandler.get(conn).emitter.addChannel(channel, fn)

// register the service
const register = ({ registerAction, createHook }) => {
    // set the options at init service step, which is before initializing sqlite service.
    registerAction({
        hook: INIT_SERVICE,
        name: `${SERVICE} sqlite`,
        trace: __filename,
        handler: async (args, ctx) => {
            const sqlite = ctx.getConfig('sqlite.connections')
            for (const options of sqlite) {
                const name = `${SQLITE_BEFORE_INIT}/${options.connectionName}`
                createHook(name, { args: { options } })
                await init(options)
            }
        },
    })

    // set the options at start service step, which is before starting sqlite service.
    registerAction({
        hook: START_SERVICE,
        name: `${SERVICE} sqlite`,
        trace: __filename,
        handler: async (args, ctx) => {
            const sqlite = ctx.getConfig('sqlite.connections')
            for (const options of sqlite) {
                const name = `${SQLITE_BEFORE_START}/${options.connectionName}`
                createHook(name, { args: { options } })
                await start(options)
            }
        },
    })
}

module.exports = {
    connectionHandler,
    getModel: connectionHandler.getModel,
    getConnection: connectionHandler.get,
    getEmitter: conn => connectionHandler.get(conn).emitter,
    query,
    listen,
    register,
}
