const Campground = require('../models/campground');
const path = require('path');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('../schemas');
const ExpressError = require('./ExpressError');
const Cloudinary = require('cloudinary').v2;

// Ensures campground matches schema 
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        console.dir(req.body)
        const msg = error.details.map(el => el.message).join(',')
        // if (req.body.isNew) {
        //     req.files.forEach(imageUrl => {
        //         Cloudinary.uploader.destroy(imageUrl.filename, { invalidate: true }, function (error, result) {
        //             if (error) console.log(error)
        //         });
        //     });
        // }
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
// Checks if user is creating new campground
// module.exports.setIsNew = (req, res, next) => {
//     req.body.isNew = true;
//     next();
// }

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.dir(req.body)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must sign in first!');
        return res.redirect('/login');
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}