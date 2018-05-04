//server.js
//express app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const http = require('http').Server(app);
const io = require('socket.io')(http);

// redis
const redisClient = require("./init-session").redisClient;
const initSession = require("./init-session").init;
initSession(app, io);

// passport 
const setupPassport = require('./passport');
setupPassport(app);

// routing
const router = require('./router')(express);
app.use("/", router);

// socket.io
const SocketRouter = require('./socketRouter');
const socketRouter = new SocketRouter(io, redisClient);
socketRouter.router();

// http.listen(8080);

// https
const localHttps = require("./local-https");
localHttps(app);