const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserInformation = require("../models/UserInformation");
const fs = require("fs");
const { randomNumber } = require("./global");

const myJson = "booking.json";

const getUserByUsername = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  const decoded = jwt.decode(token)?.UserInfo;

  const currentUser = await User.findOne({})
    .importantField()
    .byUsername(decoded.username)
    .exec();

  return currentUser;
};

const getUser = async (req) => {
  const _id = req.params.id;
  return await User.findOne({ _id }).exec();
};

const updateObjectOfObject = async (column, id, values) => {
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
};

/**
 * Remove element from array
 */
const pullArrayOfObject = async (column, id, values) => {
  const filter = {};
  filter["_id"] = id;

  await User.updateOne(filter, { $pull: { [column]: values } });
};

/**
 * Push object to array
 */
const pushArrayOfObject = async (column, id, values) => {
  const filter = {};
  filter["_id"] = id;

  await User.updateOne(filter, { $push: { [column]: values } });
};

/**
 * Update object to array
 */
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

const findUser = async ({ _id }) => {
  return await User.findOne({ _id }).exec();
};

const findUnoccupiedDriver = async () => {
  let json = null;
  let index = 0;

  const unoccupied = await User.find().importantField().byDriver().exec();

  // if there is no available driver return null
  if(unoccupied.length === 0) return null

  if (fs.existsSync(myJson)) {
    const data = fs.readFileSync(myJson);
    json = JSON.parse(data);
  }

  if (json) {
    const currentSelected = unoccupied.findIndex((x) => {
      return x._id === json.selected;
    });

    // if selected driver is equal to previous selected driver; run function again
    if (randomNumber(unoccupied.length - 1) === currentSelected)
      findUnoccupiedDriver();

    index = randomNumber(unoccupied.length - 1);

    // delete object
    delete json.selected;
  }
  const unoccupiedData = unoccupied[index];

  // if selected driver is not unoccupied run the function again
  if (unoccupiedData.status !== "Unoccupied") findUnoccupiedDriver();

  const file = {
    selected: unoccupiedData._id,
    ...json,
  };

  fs.writeFileSync(myJson, JSON.stringify(file));
  return unoccupiedData;
};

const findUserInfo = async ({ user }) => {
  return await UserInformation.findOne({ user }).mySelectRemove().exec();
};

const deleteObject = (user) => {
  delete user.trips
  delete user.addresses
  delete user.documents
  delete user.userInfo
}

const findUserByRole = async (role) => {
  return await User.find().mySelect().byGeneric('role', role).exec()
}

module.exports = {
  getUserByUsername,
  getUser,
  pushArrayOfObject,
  pullArrayOfObject,
  updateArrayOfObject,
  updateObjectOfObject,
  findUser,
  findUserInfo,
  findUnoccupiedDriver,
  deleteObject,
  findUserByRole
};
