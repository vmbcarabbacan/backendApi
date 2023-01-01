const root = require("../routes/root");
const auth = require("../routes/authRoutes");
const users = require("../routes/userRoutes");
const address = require("../routes/addressRoutes");
const document = require("../routes/documentRoutes");

const routes = [
  {
    path: "/",
    dir: root,
  },
  {
    path: "/auth",
    dir: auth,
  },
  {
    path: "/users",
    dir: users,
  },
  {
    path: "/document",
    dir: document,
  },
  {
    path: "/address",
    dir: address,
  },
  {
    path: '*',
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
