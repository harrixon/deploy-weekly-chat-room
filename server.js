//server.js
//express app
const express = require('express');
const app = express();

const fs = require('fs');
const http = require('http').Server(app);
// const https = require('https')
// const options = {
//     key: fs.readFileSync('localhost.key', 'utf-8'),
//     cert: fs.readFileSync('localhost.cert', 'utf-8')
// };
// const serverPort = 443;
// const server = https.createServer(options, app);

const io = require('socket.io')(http);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// passport / social login
const session = require('express-session');
const setupPassport = require('./passport');
app.use(session({
    secret: 'supersecret'
}));
setupPassport(app);

// redis
const redis = require("redis");
const client = redis.createClient({
    host: "localhost",
    port: 6379
});
client.on("error", function (err) {
    console.log(`REDIS: ${err}`);
});

// routing
const router = require('./router')(express);
app.use("/", router);

// socket.io
io.on('connection', (socket) => {
    let rm;
    socket.on('subscribe', function(room){
        rm = room;
        socket.join(rm);
        console.log(`a user has joined room: ${rm}`);
        io.to(rm).emit('join room', `new user in room: ${rm}.`);
    });

    socket.on('chat message', function (msg) {
        client.lpush(rm, msg, function(err, data){if (err) {throw err;}});
        console.log('message: ' + msg);
        io.to(rm).emit('chat message', msg);
    });

    socket.on('disconnect', () => console.log('a user left us'));
});

// server.listen(serverPort);

http.listen(8080);