// This module handles basic operations with Sequelize models.

const handlers = {}

const set = (name, val) => {
    handlers[name] = {
        ...val,
        models: {},
    }
}

const get = name => handlers[name]

const pushModel = (conn, model) => {
    conn.models[model.name] = model
}

const getModel = (modelName, connectionName = null) => {
    const model = Object.keys(handlers)
        .filter(item => (
            connectionName
                ? item === connectionName
                : true
        ))
        .map(name => Object.values(handlers[name].models))
        .reduce((acc, models) => [ ...acc, ...models ], [])
        .find(item => item.name === modelName)

    if (!model) {
        const connStr = connectionName
            ? `${connectionName}`
            : 'ALL CONNECTIONS'
        throw new Error(`${modelName} in ${connStr}`)
    }

    return model
}

module.exports = { set, get, pushModel, getModel }
