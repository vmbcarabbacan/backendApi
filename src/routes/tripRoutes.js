const expres = require('express')
const router = expres.Router()
const tripController = require('../controllers/tripController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/').get(tripController.getTrips)
router.route('/store').post(tripController.storeTrip)

module.exports = router
