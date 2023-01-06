const expres = require('express')
const router = expres.Router()
const documentController = require('../controllers/documentController')
const verifyJWT = require('../middleware/verifyJWT')
const upload = require("../middleware/upload");

router.use(verifyJWT)

router.route("/:id").get(upload.single("file"), documentController.getDocuments);
router.route('/store/:id').post(documentController.storeDocument)
router.route('/update/:id').put(documentController.updateDocument)

module.exports = router
