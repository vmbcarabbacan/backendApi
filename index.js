require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./src/middleware/logger");
// const headers = require('./src/middleware/headers')
const errorHandler = require("./src/middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOption = require("./src/config/corsOptions");
const connectDB = require("./src/config/conns");
const routes = require("./src/config/routes");
const mongoose = require("mongoose");
// const Grid = require("gridfs-stream");
const { PORT } = process.env;

connectDB();

app.use(logger);

// app.use(headers);

// mongoose.set('strictQuery', false);

// const conn = mongoose.connection
// conn.once('open', function() {
//   gfs = Grid(conn.db, mongoose.mongo)
//   gfs.collection("photos");
// })

app.use(cors(corsOption));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

routes.map((x) => {
  app.use(x.location, x.dir);
});

app.use(errorHandler);

//cors enable functions
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "ec2-18-183-129-38.ap-northeast-1.compute.amazonaws.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
