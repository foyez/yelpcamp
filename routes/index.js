const express     = require('express'),
      router      = express.Router(),
      passport    = require('passport'),
      User        = require('../models/user');

// ROOT ROUTE
router.get('/', (req, res) => {
  res.render('landing');
});

// SHOW REGISTER FORM
router.get('/register', (req, res) => {
  res.render('register', { page: 'register' });
});

// REGISTER LOGIC
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      // req.flash('error', err.message);
      return res.render('register', { error: err.message });
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Welcome to YelpCamp ' + user.username);
      res.redirect('/campgrounds');
    });
  });
});

// SHOW LOGIN FORM
router.get('/login', (req, res) => {
  res.render('login', {page: 'login'});
});

// LOGIN LOGIC
router.post('/login',passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}) , (req, res) => {
});

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('succes', 'Logged you out!');
  res.redirect('/campgrounds'); 
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;