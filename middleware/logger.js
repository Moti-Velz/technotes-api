const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logFileNAme) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileNAme), logItem)
    } catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    const headers  = JSON.stringify(req.headers);

    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}\t${headers}`, 'reqLog.log') 
    console.log(`${req.method} ${req.path} ${headers}`)
    next()
}

module.exports = { logEvents, logger }