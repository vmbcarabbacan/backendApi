const Address = require("../models/Address");
const { sendStatus, setUpdateValue } = require("../services/global");
const { pushArrayOfObject, updateArrayOfObject, getUser } = require("../services/users");

/**
 * @desc View addresses by :id
 * @route Get /document/:id
 * @access Private
 */
const getAddresses = async (req, res) => {
  const user = await getUser(req);
  const addresses = user.addresses;

  sendStatus(res, 200, addresses);
};

/**
 * @desc Store address
 * @route Post /address/store
 * @access Private
 */
const storeAddress = async (req, res) => {
  try {
    const user = await getUser(req);

    // create object for address
    const addressObj = {
      user,
      ...req.body,
    };
    const address = await Address.create(addressObj);

    // push address to user addresses object
    await pushArrayOfObject("addresses", user._id, address);

    sendStatus(res, 200, "successfully save");
  } catch (err) {
    sendStatus(res, 400, err.errors);
  }
};

/**
 * @desc Update address
 * @route Put /address/update/:id
 * @access Private
 */
const updateAddress = async (req, res) => {
  const { filter, update, _id } = setUpdateValue(req);
  try {
    await Address.updateOne(filter, update);

    // find updated address
    const address = await Address.findOne({ _id }).mySelectRemove().exec();

    // update the address inside user object
    await updateArrayOfObject("addresses", _id, address);

    res.json({ message: "Success" });
  } catch (err) {
    sendStatus(res, 401, err.message);
  }
};

module.exports = {
  getAddresses,
  storeAddress,
  updateAddress,
};
