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
const { PORT } = process.env;
// socket
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const socket = require('./src/services/socketio')

const io = new Server(httpServer, { cors: {
  origin: 'http://localhost:8080',
  methods: ["GET", "POST"],
}});


connectDB();

app.use(logger);

// app.use(headers);

app.use(cors(corsOption));

app.use(express.json());

app.use(cookieParser());

socket(io);

app.use("/", express.static(path.join(__dirname, "public")));

routes.map((x) => {
  app.use(x.location, x.dir);
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  httpServer.listen(PORT);
});

mongoose.connection.on("error", (err) => {
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
