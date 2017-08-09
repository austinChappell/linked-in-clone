const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/directory',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  console.log('body', req.body);
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save((err) => {
    if (err) {
      console.log('There was an error saving the user', err);
    }
    next();
    // res.redirect('/home');
  });
}, passport.authenticate('local', {
  successRedirect: '/directory'
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
