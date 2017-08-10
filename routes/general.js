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

router.post('/editprofile', authRequired, (req, res) => {
  let id = req.session.passport.user;
  const editProfile = {
    username: req.body.username,
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
  };
  User.update({ _id: id }, { $set: editProfile }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.redirect('/profile');
    }
  })
})

router.post('/delete', authRequired, (req, res) => {
  User.remove({ _id: req.session.passport.user }, (err) => {
    if (err) {
      console.log(err);
    } else {
      req.logout();
      res.redirect('/');
    }
  })
})

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
