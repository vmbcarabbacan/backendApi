const expres = require('express')
const router = expres.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/').get(userController.getUsers)
router.route('/current-user').get(userController.getCurrentUser)
router.route('/:id').get(userController.getUserById)
router.route('/role').post(userController.getUserByRole)
router.route('/update/:id').put(userController.updateUser)
router.route('/pagination').get(userController.getPagination)

module.exports = router
