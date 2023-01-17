const allowedOrigins = require('./allowedOrigin')

const corsOption = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTIONS'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204
}

module.exports = corsOption