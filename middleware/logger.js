const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}`

    const dir = path.join(__dirname, '..', 'logs')
    const dirFile = path.join(__dirname, '..', 'logs', logFileName)

    try {
        if(!fs.existsSync(dir)) {
            await fsPromise.mkdir(dir)
        }

        await fsPromise.appendFile(dirFile, logItem)
    } catch (error) {
        console.log(error)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    next()
}

module.exports = { logEvents, logger }