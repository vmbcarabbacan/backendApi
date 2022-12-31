const headers = (req, res, next) => {
    req.headers['Content-Type'] = 'application/json'

    next()
}

module.exports = headers
