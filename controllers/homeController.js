/* GET home page. */
exports.index = (req, res, next) => {
    res.render('index', { title: 'Book Store', active_home: true, user: req.user });
}

exports.login = (req, res, next) => {
    res.render('login', { message: req.flash('loginMessage'), user: req.user });
};

exports.signup = (req, res, next) => {
    res.render('signup', { message: req.flash('signupMessage'), user: req.user });
}