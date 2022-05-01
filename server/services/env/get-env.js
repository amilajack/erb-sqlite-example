const getEnv = (name, defaultValue) => {
    const value = process.env[name]

    if (value !== undefined) {
        return value
    }

    if (defaultValue !== undefined) {
        return defaultValue
    }

    throw new Error(`Env.${name} must be declared`)
}

module.exports = {
    getEnv,
}