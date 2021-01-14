var LocalStrategy = require('passport-local').Strategy,
    User = require('../models/authModel');
var bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done) => {
        try {
            let user = await User.getId(id);
            if (!user) {
                return done(new Error('user not found'));
            }
            done(null, user);
        } catch (e) {
            done(e);
        }
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.get(email, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        User.add(req, email, password);
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function(req, email, password, done) {
            User.get(email, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                let match = bcrypt.compareSync(password, user.password);
                if (!match)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                if (user.status == "deactivated")
                    return done(null, false, req.flash('loginMessage', 'Your account has been deactivated! We will inform your account\'s status to your E-mail'));
                return done(null, user);
            });
        }));
}