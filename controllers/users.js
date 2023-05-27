const passport = require('passport');
const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.registerNewUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    console.log(req.session.returnTo)
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    req.flash('success', 'Welcome Back!');
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((e) => {
        if (e) {
            req.flash('error', 'Something Went Wrong!');
            console.log(e);
            res.redirect('/campgrounds');
        }
    });
    req.flash('success', 'Successfully Logged Out!')
    res.redirect('/campgrounds')
}