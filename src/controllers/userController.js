const User = require("../models/User");
const { sendStatus } = require('../services/global')

/**
 * @desc Get all users with metas
 * @route Get /users
 * @access Public - will be change to Private after
 */
const getUsers = async (req, res) => {
  const users = await User.find().select('-password, -__v').populate('UserInformation')
  if (!users?.length) return sendStatus(res, 400, 'No user found')

  res.json(users)
};

module.exports = {
    getUsers
}
