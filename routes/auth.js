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
    password: req.body.password,
    name: req.body.name,
    avatar: req.body.avatarURL,
    email: req.body.email,
    university: req.body.university,
    job: req.body.job,
    company: req.body.company,
    skills: req.body.skills,
    phone: req.body.phone,
    street_num: req.body.street_num,
    street_name: req.body.street_name,
    city: req.body.city,
    state_or_province: req.body.state_or_province,
    country: req.body.country
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
