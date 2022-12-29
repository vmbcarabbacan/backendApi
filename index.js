require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./src/middleware/logger')
const errorHandler = require('./src/middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOption = require('./src/config/corsOptions')
const connectDB = require('./src/config/conns')
const mongoose = require('mongoose')
const { PORT } = process.env

connectDB()

app.use(logger)

app.use(cors(corsOption))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./src/routes/root'))
app.use('/auth', require('./src/routes/authRoutes'))
app.use('/users', require('./src/routes/userRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
