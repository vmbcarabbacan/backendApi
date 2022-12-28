const User = require("../models/User");
const { sendStatus } = require('../services/global')

/**
 * @desc Get all users with metas
 * @route Get /users
 * @access Public - will be change to Private after
 */
const getUsers = async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "usermetas",
        localField: "_id",
        foreignField: "user",
        as: "metas",
      },
    },
    {
        $replaceRoot: { newRoot: {
            $mergeObjects: [ { $arrayElemAt: [
                "$metas", 0
            ] }, "$$ROOT" ]
        } }
    },
    {
        $project: { metas: 0 }
    }
  ])
  if (!users?.length) return sendStatus(res, 400, 'No user found')

  res.json(users)
};

module.exports = {
    getUsers
}
