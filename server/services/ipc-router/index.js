const { SERVICE, INIT_SERVICE, START_SERVICE } = require('@forrestjs/hooks')
const { IPCROUTER_BEFORE_INIT, IPCROUTER_BEFORE_START } = require('./hooks')
const { start } = require('./start')


// register the service
const register = ({ registerAction, createHook }) => {
    // set the options at init service step, which is before initializing the service.
    registerAction({
        hook: INIT_SERVICE,
        name: `${SERVICE} ipcRouter`,
        trace: __filename,
        handler: async (args, ctx) => {
            const name = `${IPCROUTER_BEFORE_INIT}`
            createHook(name)
        },
    })

    // set the options at start service step, which is before starting the service.
    registerAction({
        hook: START_SERVICE,
        name: `${SERVICE} ipcRouter`,
        trace: __filename,
        handler: async (args, ctx) => {
            const ipcRouter = ctx.getConfig('ipcMain.routes')
            for (const options of ipcRouter) {
                const name = `${IPCROUTER_BEFORE_START}`
                createHook(name, { args: { options } })
                await start(options)
            }
        },
    })
}

module.exports = {
    register,
}
