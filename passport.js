//passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const users = require('./users');
const bcrypt = require('./bcrypt');
require('dotenv').config();

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('facebook', new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_OAUTH_CBURL
            // callbackURL: process.env.FACEBOOK_OAUTH_CBURL_DEV
        },
        function (accessToken, refreshToken, profile, cb) {
            return cb(null, { profile: profile, accessToken: accessToken });
        }
    ));

    passport.use('local-login', new LocalStrategy(
        (email, password, done) => {
            let user = users.find((user) => user.email == email);
            // console.log(user);
            if (user == null) {
                return done(null, false, { message: 'Incorrect credentials, no such email.' });
            }

            bcrypt.checkPassword(password, user.password)
                .then(result => {
                    if (result) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect credentials, incorrect pw.' });
                    }
                })
                .catch(err => console.log(err));
        }
    ));

    passport.use('local-signup', new LocalStrategy(
        (email, password, done) => {
            let user = users.find((user) => user.email == email);
            if (user) {
                return done(null, false, { message: 'Email already taken' });
            } else {
                bcrypt.hashPassword(password)
                    .then(hash => {
                        const newUser = {
                            email: email,
                            password: hash
                        };
                        console.log(newUser);
                        users.push(newUser);
                        return done(null, newUser);
                    })
                    .catch(err => console.log(err));
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((sessionUser, done) => {
        console.log("sessionUser", sessionUser);
        if (sessionUser.profile != null) {
            if (sessionUser.profile.provider == 'facebook') {
                if (sessionUser.profile) {
                    done(null, sessionUser.profile)
                }
                else {
                    done(new Error('facebook sessionUser failed.'));
                }
            }
        }
        else if (sessionUser.email) {
            let user = users.find((u) => u.email == sessionUser.email);
            if (user == null) {
                done(new Error('wrong email.'));
            }
            else {
                done(null, user);
            }
        }
    });
};