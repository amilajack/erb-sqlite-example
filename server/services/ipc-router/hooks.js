const { SERVICE } = require('@forrestjs/hooks')

// Tips:
// always have before init & before start hooks for services to be able to hook actions to them.

const IPCROUTER_BEFORE_INIT = `${SERVICE} ipcRouter/beforeInit`
const IPCROUTER_BEFORE_START = `${SERVICE} ipcRouter/beforeStart`

module.exports = {
    IPCROUTER_BEFORE_INIT,
    IPCROUTER_BEFORE_START,
}
