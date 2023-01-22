const User = require("../models/User");
const UserInformation = require("../models/UserInformation");
const bcrypt = require("bcrypt");
const { sendStatus, setUpdateValue, isEmpty } = require("../services/global");
const { getUserByUsername, findUserInfo, updateObjectOfObject } = require("../services/users");

/**
 * @desc Get all user
 * @route Get /users
 * @access Private
 */
const getUsers = async (req, res) => {
  const users = await User.find().select("-password, -__v");
  if (!users?.length) return sendStatus(res, 400, "No user found");

  res.json(users);
};

/**
 * @desc Get users in pagination
 * @route Get /users/paginated/:id
 * @access Private
 */
const getPagination = async (req, res) => {
  const page = parseInt(req.query.page);
  const per_page = 2;
  const indexStart = (page - 1) * per_page;
  const indexEnd = indexStart + per_page;

  const cursor = await User.find().skip(indexStart).limit(per_page).exec();
  const count = await User.countDocuments();

  if (!cursor?.length) return sendStatus(res, 400, "No user found");

  const size = count / per_page;
  const totalPagination = Number.isInteger(size)
    ? size
    : parseInt(size.toString()) + 1;
  const objPagination = {
    data: cursor,
    total: count,
    from: indexStart + 1,
    end: indexEnd > count ? count : indexEnd,
    size: totalPagination,
  };

  res.json(objPagination);
};

/**
 * @desc Get current user
 * @route Get /users/current-user
 * @access Private
 */
const getCurrentUser = async (req, res) => {
  const currentUser = await getUserByUsername(req);

  res.json({currentUser});
};

/**
 * @desc Update user
 * @route Post /users/update
 * @access Private
 */
const updateUser = async (req, res) => {
  try {
    const { firstName, familyName, username, email, password, contactNumber } =
      req.body;

      const id = req.params.id

    // check if body contains undefined, null or empty
    if (isEmpty(Object.values(req.body)))
      return sendStatus(res, 400, "All fields are required");

    // Check for duplicates
    const duplicateUsername = await User.findOne({ username }).lean().exec();
    if (duplicateUsername?._id != id) return sendStatus(res, 409, "Duplicate username");

    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateEmail?._id != id) return sendStatus(res, 409, "Duplicate email");

    let hashPassword = null;
    if(password) {
      // Hash password
      hashPassword = await bcrypt.hash(password, 10);
    }
    delete req.body.password;

    // create object for user
    const fullName = `${firstName} ${familyName}`;
    const userObject = {
      ...req.body,
      name: fullName,
    };
    
    if(hashPassword) {
      userObject['password'] = hashPassword
    }

    const { filter, update, _id } = setUpdateValue(req, userObject);
    await User.updateOne(filter, update);

    const userInfo = await findUserInfo({ user: _id })
    const userInfoObject = {
      firstName,
      familyName,
      contactNumber,
    }

    // update user information table
    const { filter:infoFilter, update:infoUpdate, _id:infoId } = setUpdateValue(req, userInfoObject, userInfo._id)
    await UserInformation.updateOne(infoFilter, infoUpdate)

    // // update user info inside user object
    const updatedInfo = await findUserInfo({ user: _id })
    await updateObjectOfObject('userInfo', _id, updatedInfo)

    sendStatus(res, 200, 'Success');
  } catch (err) {
    sendStatus(res, 401, err.errors);
  }
};

module.exports = {
  getUsers,
  getPagination,
  getCurrentUser,
  updateUser
};
