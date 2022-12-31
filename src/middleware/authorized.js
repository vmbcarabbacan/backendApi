const { sendStatus } = require("../services/global");

const authorized = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.authorization;

  const token = authHeader?.split(" ")[1];
  const response = ["null", null, "undefined", undefined];

  if (!response.includes(token))
    return sendStatus(res, 403, "Unable to process request. Please logout first");

  next();
};

module.exports = authorized;
