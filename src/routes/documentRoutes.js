const expres = require('express')
const router = expres.Router()
const documentController = require('../controllers/documentController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/store/:id').post(documentController.storeDocument)
router.route('/update/:id').put(documentController.updateDocument)

module.exports = router
