const express    = require('express'),
      router     = express.Router(),
      Campground = require('../models/campground'),
      middleware = require('../middleware');

// INDEX ROUTE - show all campgrounds
router.get('/', (req, res) => {
  Campground.find({ }, (err, campgrounds) => {
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds, page: 'camprounds' });
    }
  });
});

// CREATE ROUTE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const price = req.body.price;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = { name, image, price, description, author };
  Campground.create(newCampground, (err, campground) => {
    if(err) {
      console.log(err);
    } else {
      console.log(campground);
      res.redirect('/campgrounds');
    }
  });
});

// NEW ROUTE - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW ROUTE - shows more info about one campground
router.get('/:id', (req, res) => {
  // find the campground with provided ID
  Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
    if(err) {
      console.log(err);
    } else {
      console.log(campground);
      res.render('campgrounds/show', { campground });
    }
  });
});

// EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      req.flash('error', 'Campground not found');
    } else {
      res.render('campgrounds/edit', { campground });
    }
  });
});

// UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate( req.params.id, req.body.campground, (err, campground) => {
    if(err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;