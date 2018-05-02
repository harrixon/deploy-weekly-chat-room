//server.js
//express app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const http = require('http').Server(app);

// const https = require('https')
// const fs = require('fs');
// const options = {
//     key: fs.readFileSync('localhost.key', 'utf-8'),
//     cert: fs.readFileSync('localhost.cert', 'utf-8')
// };
// const serverPort = 443;
// const server = https.createServer(options, app);

// redis
const redis = require("redis");
const client = redis.createClient({
    host: "localhost",
    port: 6379
});
client.on("error", function (err) {
    console.log(`REDIS: ${err}`);
});

const io = require('socket.io')(http);

// passport / social login / session
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const setupPassport = require('./passport');
const sessionStore = new RedisStore({
    client: client,
    unset: "destroy"
});
const settings = {
    store: sessionStore,
    secret: "supersecret",
    cookie: { "path": '/', "httpOnly": true, "secure": false, "maxAge": null }
}
app.use(session(settings));
setupPassport(app);

// routing
const router = require('./router')(express);
app.use("/", router);

// socket.io
io.on('connection', (socket) => {
    let rm;
    socket.on('subscribe', function (room) {
        rm = room;
        socket.join(rm);
        console.log(`a user has joined room: ${rm}`);
        io.to(rm).emit('join room', `new user in room: ${rm}.`);
    });

    socket.on('chat message', function (msg) {
        client.lpush(rm, msg, function (err, data) { if (err) { throw err; } });
        console.log('message: ' + msg);
        io.to(rm).emit('chat message', msg);
    });

    socket.on('disconnect', () => console.log('a user left us'));
});

// https
// server.listen(serverPort);

http.listen(8080);