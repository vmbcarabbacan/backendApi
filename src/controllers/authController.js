const User = require('../models/User')
const UserInformation = require('../models/UserInformation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { containUndefined, containNull, containEmpty, sendStatus } = require('../services/global')

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env
/**
 * @desc Login
 * @route POST /auth
 * @access Public
 */
const login = async (req, res) => {
    const { username, password } = req.body

    if(!username || !password) return res.status(400).json({ message: 'All fields are required' })

    const user = await User.findOne({ username }).exec()

    if(!user || !user.active) return res.status(401).json({ message: 'Unauthorized' })

    const match = await user.isValidPassword(password)

    if(!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
        "UserInfo": {
            "username": user.username,
            "role": user.role
        }
    }, ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
    )

    const refreshToken = jwt.sign(
        { "username": user.username },
        REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'}
    )

    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // accessible only on web server
        secure: true, // https
        sameSite: 'None', // cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry set to match refreshToken
    })

    // send accessToken containing name, email username and role
    res.json({ accessToken })
}

/**
 * @desc Registration
 * @route Post /auth/register
 * @access Public
 */
const register = async (req, res) => {
    try {
        const { firstName, familyName, username, email, password } = req.body

        // check if body contains undefined, null or empty
        if(containUndefined(Object.values(req.body)) || containNull(Object.values(req.body)) || containEmpty(Object.values(req.body))) return sendStatus(res, 400, 'All fields are required')

        // Check for duplicates
        const duplicateUsername = await User.findOne({ username }).lean().exec()
        if(duplicateUsername) return sendStatus(res, 409, 'Duplicate username')

        const duplicateEmail = await User.findOne({ email }).lean().exec()
        if(duplicateEmail) return sendStatus(res, 409, 'Duplicate email')

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10)
        delete req.body.password
        
        const fullName = `${firstName} ${familyName}`
        const userObject = {
            ...req.body,
            name: fullName,
            password: hashPassword,
        }

        // create and store new user
        const user = await User.create(userObject)

        //create and store other information
        const userObj = {
            firstName: req.body.firstName,
            familyName: req.body.familyName
        }
        const information = await UserInformation.create(userObj)

        user.UserInformation = information
        await user.save()


        if(!user) return sendStatus(res, 500, 'Server Error') 
        
        const accessToken = jwt.sign(
            {
            "UserInfo": {
                "username": user.username,
                "role": user.role
            }
        }, ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
        )

        const refreshToken = jwt.sign(
            { "username": user.username },
            REFRESH_TOKEN_SECRET,
            {expiresIn: '7d'}
        )

        // Create secure cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true, // accessible only on web server
            secure: true, // https
            sameSite: 'None', // cross-site cookie
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry set to match refreshToken
        })

        // send accessToken containing name, email username and role
        res.json({ accessToken })
    } catch (err) {
        console.log(err)
    }
}

/**
 * @desc Create user meta
 * @access Private
 */
const createUserMeta = async (meta) => {
    // create and store user metas
    await UserMeta.create(meta)
}

/**
 * @desc Reresh
 * @route Get /auth/refresh
 * @access Public - access token expired
 */
const refresh = (req, res) => {
    const cookie = req.cookie

    if(!cookie?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookie.jwt

    jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err) return res.status(403).json({ message: 'Forbidden' })

            const user = User.findOne({ username: decoded.username }).exec()

            if(!user) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": user.username,
                        "role": user.role
                    }
                }, ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            )
            res.json({ accessToken })
        }
    )
}

/**
 * @desc Logout
 * @route POST /auth/logout
 * @access Public - clear the cookie if exists
 */
const logout = (req, res) => {
    const cookie = req.cookie
    if(!cookie?.jwt) return res.sendStatus(204) // no content

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login, refresh, logout, register
}
