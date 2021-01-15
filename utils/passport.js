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
        async(req, email, password, done) => {
            try {
                let user = await User.findByEmail(email);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    let token = await User.register(req, email, password);
                    try {
                        await User.sendConfirmToken(email, token);
                        return done(null, null, req.flash('signupMessage', 'A verification email has been sent to your E-mail.'))
                    } catch {
                        return done(null, null, req.flash('signupMessage', 'Can not send verification Email to your account!'))
                    }
                }
            } catch (error) {
                return done(error);
            }
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async(req, email, password, done) => {
            try {
                let user = await User.findByEmail(email);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                let match = bcrypt.compareSync(password, user.password);
                if (!match)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                if (user.status == "deactivated")
                    return done(null, false, req.flash('loginMessage', 'Your account has been deactivated! We will inform your account\'s status to your E-mail'));
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }));
}