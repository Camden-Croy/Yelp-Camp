const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, setIsNew, validateCampground } = require('../utils/middleware');
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');
const Review = require('../models/review');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });
// Displays all campgrounds by name - no details
router.get('/', catchAsync(campgrounds.index));

router.route('/new')
    .get(isLoggedIn, catchAsync(campgrounds.renderNew))
    // setIsNew, - if after cruds finished if I decide to fix validation
    .post(isLoggedIn, upload.array('campground[image]'), validateCampground, catchAsync(campgrounds.createNew));


router.route('/:id')
    .get(catchAsync(campgrounds.renderCamp))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.createEdit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit));


module.exports = router;