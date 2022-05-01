const { SERVICE } = require('@forrestjs/hooks')

// Tips:
// always have before init & before start hooks for services to be able to hook actions to them.

const SQLITE_BEFORE_INIT = `${SERVICE} sqlite/beforeInit`
const SQLITE_BEFORE_START = `${SERVICE} sqlite/beforeStart`

module.exports = {
    SQLITE_BEFORE_INIT,
    SQLITE_BEFORE_START,
}
