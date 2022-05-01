const connectionHandler = require('./connection-handler')
const Sequelize = require('sequelize')

const init = async (settings) => {
    const name = settings.connectionName || 'default'
    // connect to db here
    const handler = new Sequelize(settings.database, settings.username, settings.password, {
        dialect: 'sqlite',
        storage: settings.database,
        operatorsAliases: {},
    })

    // set the models here
    connectionHandler.set(name, {
        name,
        settings,
        handler,
        logger: settings.activityLogger || (() => {}),
    })
}

module.exports = init
