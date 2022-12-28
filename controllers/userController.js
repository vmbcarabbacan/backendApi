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
        let: { id: "$_id" },
        pipeline: [
          { $match: 
            { $expr: 
              { $and:
                 [
                  { $eq: ["$meta", "firstName"] },
                  { $eq: ["$user", "$$id"] }
                ]
              }
            }
          },
          {
            $project: {
              value: 1
            }
          }
        ],
        as: "firstName",
      },
    },
    
  ])
  if (!users?.length) return sendStatus(res, 400, 'No user found')

  res.json(users)
};

module.exports = {
    getUsers
}
