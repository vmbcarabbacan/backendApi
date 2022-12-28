#generate token
require('crypto').randomBytes(64).toString('hex')

#secure
13FGZd46HfgGSSJ8

#username
vmbcarabbacan

#links
https://databasefaqs.com/mongodb-join-two-collections
https://mongoosejs.com/docs/validation.html

#samples
one to many with condition
------
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