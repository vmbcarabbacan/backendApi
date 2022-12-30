const User = require("../models/User");
const { sendStatus } = require('../services/global')

/**
 * @desc Get all user
 * @route Get /users
 * @access Public - will be change to Private after
 */
const getUsers = async (req, res) => {
  const users = await User.find().select('-password, -__v')
  if (!users?.length) return sendStatus(res, 400, 'No user found')

  res.json(users)
};

/**
 * @desc Get users in pagination
 * @route Get /users/paginated/:id
 * @access Public - will be change to Private after
 */
const getPagination = async(req, res) => {
  const page = 1
  const per_page = 2
  const indexStart = (page - 1) * per_page
  const indexEnd = indexStart + per_page

  const cursor = await User.find().skip(indexStart).limit(per_page).exec()
  const count = await User.countDocuments()

  if (!cursor?.length) return sendStatus(res, 400, 'No user found')
  
  const size = count / per_page
  const totalPagination = Number.isInteger(size) ? size : parseInt(size.toString()) + 1
  const objPagination = {
      data: cursor,
      total: count,
      from: indexStart + 1,
      end: indexEnd > count ? count : indexEnd,
      size: totalPagination
  }

  res.json(objPagination)
}



module.exports = {
    getUsers,
    getPagination
}
