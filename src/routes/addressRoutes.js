const expres = require("express");
const router = expres.Router();
const addressController = require("../controllers/addressController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/:id").get(addressController.getAddresses);
router.route("/store/:id").post(addressController.storeAddress);
router.route("/update/:id").put(addressController.updateAddress);

module.exports = router;
