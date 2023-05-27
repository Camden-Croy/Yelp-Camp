if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// Routes
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
// sesssion & Flash
const session = require('express-session');
const flash = require('connect-flash');
// Password verification
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const multer = require('multer');
const upload = multer({ dest: '/uploads' })

const methodOverride = require('method-override');
const { findByIdAndUpdate } = require('./models/campground');
const morgan = require('morgan');
const { nextTick } = require('process');
const { request } = require('http');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const { isReadable } = require('stream');
const { date } = require('joi');


// Mongo Setup 
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection Error:'));
db.once('open', () => {
    console.log('Mongo Connected');
});


const app = express();

// EJS Config
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));





// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')));
// Example Middleware Made by your's truely
app.use((req, res, next) => {
    req.requestTime = Date.now();
    next();
})

// session config
const sessionConfig = {
    secret: 'thisshouldbebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
}

app.use(session(sessionConfig));
app.use(flash());
// flash middleware 



// password middleware
// important that passport.session is below session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

//Routes Begin 

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes);


// Error Handling Middleware

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((error, req, res, next) => {
    const { statusCode = 500 } = error;
    if (!error.message) error.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { error })
})


app.listen(3000, () => {
    console.log('Serving Port: 3000')
})

