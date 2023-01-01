const expres = require('express')
const router = expres.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/').get(userController.getUsers)
router.route('/update/:id').put(userController.updateUser)
router.route('/pagination').get(userController.getPagination)
router.route('/current-user').get(userController.getCurrentUser)

module.exports = router
