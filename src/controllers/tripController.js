const Trip = require("../models/Trip");
const User = require("../models/User");
const { sendStatus, setUpdateValue } = require("../services/global");
const {
  getUser,
  getUserByUsername,
  pushArrayOfObject,
  findUnoccupiedDriver,
  deleteObject,
} = require("../services/users");

/**
 * @desc View all trips by :id
 * @route Get /trip/:id
 * @access Private
 */
const getTrips = async (req, res) => {
  const user = await getUserByUsername(req);
  const trips = user.trips;

  sendStatus(res, 200, trips);
};

/**
 * @desc Store trips
 * @route Post /trip/store
 * @access Private
 */
const storeTrip = async (req, res) => {
  try {
    const user = await getUserByUsername(req);

    const isPending = await user.trips.filter((x) => {
      return x.status === "Pending";
    });

    if (isPending.length > 0)
      sendStatus(
        res,
        400,
        "You have existing booking in our system. Please cancel the previous booking first"
      );

    const driver = await findUnoccupiedDriver();

    deleteObject(user);
    // create object for trip
    const tripObj = {
      passenger: user,
      driver,
      ...req.body,
    };

    const trip = await Trip.create(tripObj);

    // push trip to user trips object
    await pushArrayOfObject("trips", user._id, trip);

    // push trip to driver object
    if (driver) {
      const driverObj = {
        status: "Occupied",
      };
      const { filter, update } = setUpdateValue(req, driverObj, driver._id);
      await User.updateOne(filter, update);
      // delete driver object
      delete trip.driver;
      await pushArrayOfObject("books", driver._id, trip);
    }

    sendStatus(res, 200, "successfully save");
  } catch (err) {
    sendStatus(res, 400, err.errors);
  }
};

module.exports = {
  getTrips,
  storeTrip,
};
