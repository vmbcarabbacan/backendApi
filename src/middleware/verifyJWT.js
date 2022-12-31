const jwt = require('jsonwebtoken')
const { sendStatus } = require('../services/global')

const { ACCESS_TOKEN_SECRET } = process.env

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) return sendStatus(res, 401, 'Unauthorized')

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) sendStatus(res, 403, 'Forbidden')
            req.user = decoded.UserInfo.username
            req.role = decoded.UserInfo.role
            next()
        }
    )
}

module.exports = verifyJWT 