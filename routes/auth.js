const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

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

  const username = req.body.username,
        password = req.body.password,
        name = req.body.name,
        avatar = req.body.avatarURL,
        email = req.body.email,
        university = req.body.university,
        job = req.body.job,
        company = req.body.company,
        phone = req.body.phone;

  const passwordHash = bcrypt.hashSync(password, 10);
  const client = new Client();

  client.connect().then(() => {
    const sql = `INSERT INTO usertable (username, passwordhash, name, avatar, email, university, job, company, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

    const params = [username, passwordHash, name, avatar, email, university, job, company, phone];

    return client.query(sql, params);
  }).then(() => {
    passport.authenticate('local', {
      successRedirect: '/directory'
    });
  });
});







//
//
//
//   console.log('body', req.body);
//   let skillsArr = req.body.skills.split(';');
//   const user = new User({
//     address: {
//       street_num: req.body.street_num,
//       street_name: req.body.street_name,
//       city: req.body.city,
//       state_or_province: req.body.state_or_province,
//       country: req.body.country
//     }
//   });
//   user.save((err) => {
//     if (err) {
//       console.log('There was an error saving the user', err);
//     }
//     next();
//     // res.redirect('/home');
//   });
// }, passport.authenticate('local', {
//   successRedirect: '/directory'
// }));
//
// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });

module.exports = router;
