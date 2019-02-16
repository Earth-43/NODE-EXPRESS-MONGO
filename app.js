'use strict';

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//load routes 

const ideas_routes = require('./routes/ideas');
const user_routes = require('./routes/user');

// config   

require('./config/passport')(passport);

// DB config

const db = require('./config/database');

//Connect to mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
}).then(() => {
    console.log(`Database connected...`);
}).catch(err => {
    console.error(`error occurred while connecting database ${err}`)
});

//load Idea model
require('./models/Ideas');
const Idea = mongoose.model('ideas');



//Handlebars middleware

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override middleware
app.use(methodOverride('_method'));

// express session middleware

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//ABOUT Route
app.get('/about', (req, res) => {
    res.render('about');
});

//static folder
app.use(express.static(path.join(__dirname, 'public')));



app.use('/ideas', ideas_routes);
app.use('/user', user_routes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server strated on port ${port}`);
});