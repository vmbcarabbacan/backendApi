const expres = require('express')
const router = expres.Router()
const userController = require('../controllers/userController')

router.route('/').get(userController.getUsers)

module.exports = router
