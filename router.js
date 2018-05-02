//router.js
// const express = require('express');
const passport = require('passport');

module.exports = (express) => {
    const router = express.Router();

    function isLoggedIn(req, res, next) {
        // console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }

    router.get('/', isLoggedIn, (req, res) => {
        // console.log('right b4 redir to room');
        res.redirect('/room');
    });

    router.get('/login', (req, res) => {
        // console.log('login page')
        res.sendFile(__dirname + '/login.html');
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/room',
        failureRedirect: '/error'
    }));

    router.get("/auth/facebook", passport.authenticate('facebook', {
        // successRedirect: '/room',
		// failureRedirect: '/login',
		authType: 'rerequest',
        scope: ['user_friends', 'manage_pages']
    }));

    router.get("/auth/facebook/callback", passport.authenticate('facebook', {
        failureRedirect: "/login"
    }), (req, res) => { 
        // console.log('FB login ok, now redirect to room.');
        res.redirect('/room');
    });

    router.get('/room', (req, res) => {
        res.sendFile(__dirname + '/room.html');
    });

    router.get('/error', (req, res) => {
        res.send('You are not logged in!');
    });

    return router;
};