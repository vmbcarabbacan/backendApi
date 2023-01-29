const User = require("../models/User");
const UserInformation = require("../models/UserInformation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmpty, sendStatus } = require("../services/global");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
/**
 * @desc Login
 * @route POST /auth
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (isEmpty(Object.values(req.body)))
      return sendStatus(res, 400, "All fields are required");

    const user = await User.findOne({ username }).exec();

    if (!user || !user.active) return sendStatus(res, 401, "Unauthorized");

    const match = await user.isValidPassword(password);

    if (!match) return sendStatus(res, 401, "Unauthorized");

    if(!user.active && !['Driver'].includes(user.role)) return sendStatus(res, 401, 'Unauthrized')

    const token = jwt.sign(
      {
        UserInfo: {
          username: user.username,
          role: user.role,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // accessible only on web server
      secure: true, // https to be change
      sameSite: "None", // cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry set to match refreshToken
    });

    // send token containing name, email username and role
    res.json({ token });
  } catch (err) {
    sendStatus(res, 400, err.errors);
  }
};

/**
 * @desc Registration
 * @route Post /auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { firstName, familyName, username, email, password, contactNumber } =
      req.body;

    // check if body contains undefined, null or empty
    if (isEmpty(Object.values(req.body)))
      return sendStatus(res, 400, "All fields are required");

    // Check for duplicates
    const duplicateUsername = await User.findOne({ username }).lean().exec();
    if (duplicateUsername) return sendStatus(res, 409, "Duplicate username");

    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateEmail) return sendStatus(res, 409, "Duplicate email");

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    delete req.body.password;

    const fullName = `${firstName} ${familyName}`;
    const userObject = {
      ...req.body,
      name: fullName,
      password: hashPassword,
    };

    // create and store new user
    const user = await User.create(userObject);

    // create and store new user information in relationship with the user
    const userInfoObj = {
      user,
      firstName,
      familyName,
      contactNumber,
    };

    const userInfo = await UserInformation.create(userInfoObj);

    // save userInformation inside user for relationship filter
    user.userInfo = userInfo;
    user.save();

    if (!user) return sendStatus(res, 500, "Server Error");

    const token = jwt.sign(
      {
        UserInfo: {
          username: user.username,
          role: user.role,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // accessible only on web server
      secure: true, // https to be change
      sameSite: "None", // cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry set to match refreshToken
    });

    // send token containing name, email username and role
    res.json({ token });
  } catch (err) {
    sendStatus(res, 400, err.errors);
  }
};

/**
 * @desc Reresh
 * @route Get /auth/refresh
 * @access Public - access token expired
 */
const refresh = (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) return sendStatus(res, 401, "Unauthorized");

  const refreshToken = cookie.jwt;

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return sendStatus(res, 403, "Forbidden");

    const user = User.findOne({ username: decoded.username }).exec();

    if (!user) return sendStatus(res, 401, "Unauthorized");

    const token = jwt.sign(
      {
        UserInfo: {
          username: user.username,
          role: user.role,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  });
};

/**
 * @desc Logout
 * @route POST /auth/logout
 * @access Public - clear the cookie if exists
 */
const logout = (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(204); // no content

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
  register,
};
