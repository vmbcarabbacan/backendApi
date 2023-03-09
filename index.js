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
// const { Server } = require("socket.io");
const socket = require("socket.io");
const httpServer = createServer(app);
// const socket = require('./src/services/socketio')



connectDB();

app.use(logger);

// app.use(headers);

app.use(cors(corsOption));

app.use(express.json());

app.use(cookieParser());

// socket(io);

const loginUser = new Map();
    
app.use("/", express.static(path.join(__dirname, "public")));

routes.map((x) => {
  app.use(x.location, x.dir);
});

app.use(errorHandler);

// mongoose.connection.once("open", () => {
//   // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   httpServer.listen(PORT);
// });

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.connection.on("error", (err) => {
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});


const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);

// const io = new Server(httpServer, { cors: {
//   origin: 'http://localhost:8080',
//   methods: ["GET", "POST"],
// }});

const io = socket(server, {
  cors: {
    origin: "http://localhost:8080",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
      console.log('user disconnected');
  });

  socket.on('send-data', (data) => {
      socket.emit('receive-data', 'hello');
  })

  socket.on('login', (userId) => {
      loginUser.set(userId, socket.id);
      socket.emit('receive-data', loginUser);
  })

  socket.on('logout', (userId) => {
      loginUser.delete(userId);
  })

  socket.on('updated-profile', (data) => {
      socket.emit('receive-data', 'hellos');
      // const notifId = loginUser.get(data._id);
  })
});