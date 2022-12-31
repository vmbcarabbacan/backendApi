const expres = require('express')
const router = expres.Router()
const addressController = require('../controllers/addressController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/store').post(addressController.storeAddress)
router.route('/update/:id').post(addressController.updateAddress)

module.exports = router
