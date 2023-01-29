const User = require("../models/User");
const UserInformation = require("../models/UserInformation");
const bcrypt = require("bcrypt");
const { sendStatus, setUpdateValue, isEmpty } = require("../services/global");
const {
  getUserByUsername,
  findUserInfo,
  updateObjectOfObject,
  getUser,
  findUserByRole,
  findUser
} = require("../services/users");
const s3Uploadv2 = require("../services/awsS3");

/**
 * @desc Get all user
 * @route Get /users
 * @access Private
 */
const getUsers = async (req, res) => {
  const users = await User.getAdmins().select("-password, -__v");
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

  const cursor = await User.getAdmins().skip(indexStart).limit(per_page).exec();
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
  const user = await getUserByUsername(req);

  res.json({ user });
};

/**
 * @desc Update user
 * @route Put /users/update/:id
 * @access Private
 */
const updateUser = async (req, res) => {
  try {
    const { firstName, familyName, username, email, password, contactNumber } =
      req.body;

    const id = req.params.id;

    // check if body contains undefined, null or empty
    if (isEmpty(Object.values(req.body)))
      return sendStatus(res, 400, "All fields are required");

    // Check for duplicates
    const duplicateUsername = await User.findOne({ username }).lean().exec();
    if (duplicateUsername?._id != id)
      return sendStatus(res, 409, "Duplicate username");

    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateEmail?._id != id)
      return sendStatus(res, 409, "Duplicate email");

    let hashPassword = null;
    if (password) {
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

    if (hashPassword) {
      userObject["password"] = hashPassword;
    }

    const { filter, update, _id } = setUpdateValue(req, userObject);
    await User.updateOne(filter, update);

    const userInfo = await findUserInfo({ user: _id });
    const userInfoObject = {
      firstName,
      familyName,
      contactNumber,
    };

    // update user information table
    const {
      filter: infoFilter,
      update: infoUpdate,
      _id: infoId,
    } = setUpdateValue(req, userInfoObject, userInfo._id);
    await UserInformation.updateOne(infoFilter, infoUpdate);

    // update user info inside user object
    const updatedInfo = await findUserInfo({ user: _id });
    await updateObjectOfObject("userInfo", _id, updatedInfo);

    // sendStatus(res, 200, 'Success');
    const user = await getUser(req);
    res.json({ user });
  } catch (err) {
    sendStatus(res, 401, err.errors);
  }
};

/**
 * @desc Update user profile
 * @route Put /users/update-profile/:id
 * @access Private
 */
const updateUserProfile = async (req, res) => {
  try {
    if (!req.file) sendStatus(res, 400, "Document is missing");
    const url = await s3Uploadv2(req.file, "profile");
    const id = req.body.id

    const userInfo = await findUserInfo({ user: id });
    const userInfoObject = {
      profile: url.Location,
    };

    // update user information table
    const {
      filter: infoFilter,
      update: infoUpdate,
      _id: infoId,
    } = setUpdateValue(req, userInfoObject, userInfo._id);
    await UserInformation.updateOne(infoFilter, infoUpdate);

    // update user info inside user object
    const updatedInfo = await findUserInfo({ user: id });
    await updateObjectOfObject("userInfo", id, updatedInfo);

    // sendStatus(res, 200, 'Success');
    const user = await findUser({  _id: id });
    res.json({ user });
  } catch (error) {
    sendStatus(res, 401, error.errors);
  }
};

/**
 * @desc Get user by Id
 * @route Get /users/:id
 * @access Private
 */
const getUserById = async (req, res) => {
  try {
    const user = await getUser(req);

    res.json({ user });
  } catch (error) {
    return error;
  }
};

/**
 * @desc Get all user by role
 * @route Post /users/role
 * @access Private
 */

const getUserByRole = async (req, res) => {
  try {
    const { role } = req.body;
    const users = await findUserByRole(role);

    res.json({ users });
  } catch (error) {
    return error;
  }
};

module.exports = {
  getUsers,
  getPagination,
  getCurrentUser,
  updateUser,
  getUserById,
  getUserByRole,
  updateUserProfile,
};
