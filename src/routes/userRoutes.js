const expres = require('express')
const router = expres.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/').get(userController.getUsers)
router.route('/pagination').get(userController.getPagination)

module.exports = router
