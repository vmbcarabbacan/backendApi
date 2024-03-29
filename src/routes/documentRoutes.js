const expres = require('express')
const router = expres.Router()
const documentController = require('../controllers/documentController')
const verifyJWT = require('../middleware/verifyJWT')
// const upload = require("../middleware/upload");
const upload = require("../middleware/upload-s3");

router.use(verifyJWT)

router.route("/:id").get(documentController.getDocuments);
router.route('/store/:id').post(upload.single("file"), documentController.storeDocument)
router.route('/update/:id').put(documentController.updateDocument)

module.exports = router
