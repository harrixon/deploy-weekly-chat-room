//router.js
// const express = require('express');
const passport = require('passport');

module.exports = (express) => {
    const router = express.Router();

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }

    router.get('/', isLoggedIn, (req, res) => {
        res.redirect('/room');
    });

    router.get('/login', (req, res) => {
        res.sendFile(__dirname + '/login.html');
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/room',
        failureRedirect: '/error'
    }));

    router.get("/auth/facebook", passport.authenticate('facebook', {
        authType: 'rerequest',
        scope: ['user_friends', 'manage_pages']
    }));

    router.get("/auth/facebook/callback", passport.authenticate('facebook', {
        failureRedirect: "/login"
    }), (req, res) => {
        res.redirect('/room');
    });

    router.get('/room', (req, res) => {
        res.sendFile(__dirname + '/room.html');
    });

    router.get('/error', (req, res) => {
        res.send('You are not logged in!');
    });

    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    return router;
};