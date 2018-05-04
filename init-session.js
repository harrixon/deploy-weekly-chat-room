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
    // maxAge : 10 * 60 * 1000 ms
};

module.exports.init = (app, io) => {
    app.use(expressSession(settings));
    io.use(socketIOSession(settings).parser);
};

module.exports.redisClient = redisClient;