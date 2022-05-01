// pause a promise

const pause = time =>
    new Promise(resolve => setTimeout(resolve, time))

module.exports = pause
