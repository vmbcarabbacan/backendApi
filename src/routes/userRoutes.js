const expres = require('express')
const router = expres.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')
const upload = require("../middleware/upload-s3");

router.use(verifyJWT)

router.route('/').get(userController.getUsers)
router.route('/current-user').get(userController.getCurrentUser)
router.route('/:id').get(userController.getUserById)
router.route('/role').post(userController.getUserByRole)
router.route('/update/:id').put(userController.updateUser)
router.route('/update-profile').put(upload.single("file"), userController.updateUserProfile)
router.route('/pagination').get(userController.getPagination)

module.exports = router
