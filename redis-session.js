// // init-session
// const expressSession = require('express-session');
// const RedisStore = require('connect-redis')(expressSession);
// const socketIOSession = require("socket.io.session");
// const redisClient = require("./redis-connection");

// const sessionStore = new RedisStore({
//     client: redisClient,
//     unset: "destroy"
// });

// const settings = {
//     store: sessionStore,
//     secret: "supersecret",
//     cookie: { "path": '/', "httpOnly": true, "secure": false, "maxAge": null },
//     resave: true,
//     saveUninitialized: true
//     // maxAge : 10 * 60 * 1000 ms
// };

// module.exports.init = (app, io) => {
//     app.use(expressSession(settings));
//     io.use(socketIOSession(settings).parser);
// };

// module.exports.redisClient = redisClient;