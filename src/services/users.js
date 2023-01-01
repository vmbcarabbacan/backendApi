const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserInformation = require("../models/UserInformation");

const getUserByUsername = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  const decoded = jwt.decode(token)?.UserInfo;

  const currentUser = await User.findOne({})
    .mySelect()
    .byUsername(decoded.username)
    .exec();

  return currentUser;
};

const getUser = async (req) => {
  const _id = req.params.id
  return await User.findOne({ _id }).exec();
};

const updateObjectOfObject = async(column, id, values) => {
  const filter = {};
  const col = `_id`;
  filter[col] = id;

  Object.keys(values).map(async (key) => {
    if (values[key] && typeof values[key] === "object") {
      updateObjectOfObject(column, id, values[key]);
    }
    values[`${column}.${key}`] = values[key];

    return values;
  });

  for (const [key, value] of Object.entries(values)) {
    if (
      key.startsWith(column) &&
      ((typeof value == "string" && value !== "init") ||
        (typeof value == "object" && value.length > 0) ||
        (typeof value == "number" && value > 0))
    ) {
      const val = {};
      val[key] = value;
      await User.updateOne(filter, { $set: val });
    }
  }
}

const updateArrayOfObject = async (column, id, values) => {
  const filter = {};
  const col = `${[column]}._id`;
  filter[col] = id;

  Object.keys(values).map(async (key) => {
    if (values[key] && typeof values[key] === "object") {
      updateArrayOfObject(column, id, values[key]);
    }
    values[`${column}.$.${key}`] = values[key];

    return values;
  });

  for (const [key, value] of Object.entries(values)) {
    if (
      key.startsWith(column) &&
      ((typeof value == "string" && value !== "init") ||
        (typeof value == "object" && value.length > 0) ||
        (typeof value == "number" && value > 0))
    ) {
      const val = {};
      val[key] = value;
      await User.updateOne(filter, { $set: val });
    }
  }
};

const findUser = async({ _id }) => {
  return await User.findOne({ _id }).exec()
}

const findUserInfo = async({ user }) => {
  return await UserInformation.findOne({ user }).mySelectRemove().exec()
}

module.exports = { getUserByUsername, getUser, updateArrayOfObject, updateObjectOfObject, findUser, findUserInfo };
