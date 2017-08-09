const express = require('express');
const router = express.Router();

const User = require('../models/user');

function authRequired(req, res, next) {
  if(req.user) {
    next();
  } else {
    res.redirect('/login');
  };
};

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/directory', authRequired, (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      let data = { users };
      res.render('users', data);
    }
  })
});

router.get('/unemployed', authRequired, (req, res) => {
  User.find({ job: null }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      let data = { users: results };
      res.render('users', data);
    };
  });
});

router.get('/employed', authRequired, (req, res) => {
  User.find({ job: { $type: 2 } }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      let data = { users: results };
      res.render('users', data);
    };
  });
});

router.get('/country/:value', authRequired, (req, res) => {
  let value = req.params.value;
  User.find({ 'address.country': value }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      let data = { users: results };
      res.render('users', data);
    };
  });
});

router.get('/skills/:value', authRequired, (req, res) => {
  let value = req.params.value;
  User.find({ skills: value }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      let data = { users: results }
      res.render('users', data);
    };
  });
});

router.get('/profile', authRequired, (req, res) => {
  console.log('ID==============', req.session.passport.user);
  User.findById(req.session.passport.user, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.render('profile', result);
    };
  });
});

router.get('/editprofile', authRequired, (req, res) => {
  console.log(req.session.passport.user);
  User.findById(req.session.passport.user, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.render('edit', {result});
    };
  });
});

router.get('/:id', authRequired, (req, res) => {
  User.findById(req.params.id, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      res.render('user', results);
    };
  });
});

module.exports = router;
