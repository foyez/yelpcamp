const Campground = require('../models/campground'),
      Comment    = require('../models/comment');

// ALL THE MIDDLEWARE GOES HERE
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground) => {
      if(err) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        if(campground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You don\'t have permission');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in!');
    res.redirect('back');
  }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if(err) {
        res.redirect('back');
      } else {
        // does user own the campground?
        if(comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You don\'t have permission!');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in!');
    res.redirect('back');
  }
}

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in!');
  res.redirect('/login');
}

module.exports = middlewareObj;