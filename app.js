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
// init redis connection
const redis = require("redis");
const redisClient = redis.createClient({
    host: "localhost",
    port: 6379
});
redisClient.on("error", function (err) {
    console.log(`REDIS: ${err}`);
});

// init-session
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const socketIOSession = require("socket.io.session");

const sessionStore = new RedisStore({
    client: redisClient,
    unset: "destroy"
});
const settings = {
    store: sessionStore,
    secret: "supersecret",
    cookie: { "path": '/', "httpOnly": true, "secure": false, "maxAge": null }
}

app.use(expressSession(settings));
io.use(socketIOSession(settings).parser);

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
