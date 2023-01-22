const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')
const authorized = require('../middleware/authorized')

router.route('/').post([loginLimiter, authorized], authController.login)
router.route('/register').post(authorized, authController.register)
router.route('/refresh').get(authController.refresh)
router.route('/logout').delete(authController.logout)

module.exports = router
