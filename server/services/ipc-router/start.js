// initialize & start IPC listener

const { ipcMain } = require('electron')

// recieve ipc channel names & initialize them
const start = async (settings = {}) => {
    const { routes } = settings
    // start event listeners for each route
    routes.forEach(route => (
        ipcMain.handle(`${route.name}`, async (event, arg) => {
            // Test args here:
            // console.log('arg here', arg) // prints arg
            const result = await route.handler.method(arg)
            // event.returnValue -> synchronous reply
            // event.reply -> async reply
            return event.reply = result
        })
    ))
}


module.exports = {
    start
}
