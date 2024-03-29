const containUndefined = (arr) => {
  return arr.some((element) => element === undefined);
};

const containNull = (arr) => {
  return arr.some((element) => element === null);
};

const containEmpty = (arr) => {
  return arr.some((element) => element === "");
};

const isEmpty = (arr) => {
  if (containUndefined(arr)) return true;
  if (containNull(arr)) return true;
  if (containEmpty(arr)) return true;

  return false;
};

const sendStatus = (res, code, msg) => {
  return res.status(code).json({ message: msg });
};

const setUpdateValue = (req, objValues = null, id = null) => {
  // get id from url
  const _id = id ? id : req.params.id;

  const filter = { _id };
  const update = objValues
    ? { $set: { ...objValues } }
    : { $set: { ...req.body } };

  return { filter, update, _id };
};

/**
 * @desc get
 * @access Private
 */
const imageUrl = (file) => {
  const { IMAGE_URL } = process.env;
  const url = `${IMAGE_URL}/file/${file}`;
  return url;
};

/**
 * @desc Get random number
 */
const randomNumber = (num) => {
  return Math.floor(Math.random() * num);
};

module.exports = {
  sendStatus,
  isEmpty,
  setUpdateValue,
  imageUrl,
  randomNumber,
};
