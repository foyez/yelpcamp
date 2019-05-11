#!/usr/bin/env node
'use strict';

require('./config/config')
require('./db/mongoose')

const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      flash          = require('connect-flash'),
      passport       = require('passport'),
      LocalStrategy  = require('passport-local'),
      methodOverride = require('method-override'),
      User           = require('./models/user'),
      seedDB         = require('./seeds');

const port = process.env.PORT

// REQUIRING ROUTES
const campgroundRoutes    = require('./routes/campgrounds'),
      commentRoutes       = require('./routes/comments'),
      indexRoutes         = require('./routes/index');

// ====================
// APP CONFIG
// ====================
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); // seed the database

// ====================
// PASSPORT CONFIG
// ====================
app.use(require('express-session')({
  secret: 'Once again Rusty wins cutes dog!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // authenticate() comes from PassportLocalMongoose
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// add currUsr all routes
app.use((req, res, next) => {
  res.locals.currUsr = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, () => console.log('The YelpCamp Server has started!!!'));
// app.listen(3000, () => console.log('The YelpCamp Server has started!!!'));