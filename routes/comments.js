const express = require('express'),
      router  = express.Router({ mergeParams: true }),
      Campground = require('../models/campground'),
      Comment     = require('../models/comment'),
      middleware  = require('../middleware');

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if(err) {
          req.flash('error', 'Something went wrong!');
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save to DB
          comment.save();
          campground.comments.push(comment);
          campground.save();
          // redirect campground show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if(err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', { campground_id: req.params.id, comment });
    }
  });
});

// UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
    if(err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if(err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

module.exports = router;