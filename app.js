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

http.listen(8080);

// https
// const https = require('https')
// const fs = require('fs');
// const options = {
//     key: fs.readFileSync('/localhost_key_cert/localhost.key', 'utf-8'),
//     cert: fs.readFileSync('/localhost_key_cert/localhost.cert', 'utf-8')
// };
// 
// const serverPort = 443;
// const server = https.createServer(options, app);
// 
// server.listen(serverPort);
