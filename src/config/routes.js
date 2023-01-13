const root = require("../routes/root");
const auth = require("../routes/authRoutes");
const users = require("../routes/userRoutes");
const address = require("../routes/addressRoutes");
const document = require("../routes/documentRoutes");
const trip = require("../routes/tripRoutes");
const path = require("path");

const routes = [
  {
    location: "/",
    dir: root,
  },
  {
    location: "/auth",
    dir: auth,
  },
  {
    location: "/users",
    dir: users,
  },
  {
    location: "/document",
    dir: document,
  },
  {
    location: "/address",
    dir: address,
  },
  {
    location: "/trip",
    dir: trip,
  },
  {
    location: '*',
    dir: (req, res) => {
        res.status(404);
        if (req.accepts("html")) {
          res.sendFile(path.join(__dirname, "views", "404.html"));
        } else if (req.accepts("json")) {
          res.json({ message: "404 not Found" });
        } else {
          res.type("txt").send("404 Not Found");
        }
      }
  }
];

module.exports = routes;
