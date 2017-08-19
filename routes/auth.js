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

  function findSkill(skill) {

    const sql = `SELECT * FROM skill WHERE skill = $1`;
    const params = [skill];

    client.query(sql, params).then((results) => {

      console.log('THESE ARE THE INDIVIDUAL RESULTS ====================', results);
      if (results.rows.length === 0) {
        const sql = 'INSERT INTO skill (skill) VALUES ($1)';
        const params = [skill];
        client.query(sql, params);
      }
    })
  };

  function saveSkillToUser(skill, user_id) {
    const sql = 'SELECT * FROM skill WHERE skill = $1';
    const params = [skill];

    client.query(sql, params).then((results) => {
      const skill_id = results.rows[0].skill_id;
      const sql = 'INSER INTO user_skill (user_id, skill_id) VALUES ($1, $2)';
      const params = [user_id, skill_id];

      client.query(sql, params);
    })
  };

  // eliminate any white space at the beginning or end of each element in the array
  function clearSpace(arr) {
    let newArr = [];
    arr.forEach((item) => {
      while (item[0] === ' ') {
        let newItem = item.slice(1, item.length);
        item = newItem;
      }
      while (item[item.length - 1] === ' ') {
        let newItem = item.slice(0, item.length - 1);
        item = newItem;
      }
      if (item !== '') {
        newArr.push(item);
      }
    });
    return newArr;
  };


  const username = req.body.username,
        password = req.body.password,
        name = req.body.name,
        avatar = req.body.avatarURL,
        email = req.body.email,
        university = req.body.university,
        job = req.body.job,
        company = req.body.company,
        phone = req.body.phone,
        streetNum = req.body.street_num,
        streetName = req.body.street_name,
        city = req.body.city,
        state = req.body.state_or_province,
        country = req.body.country;

  let skillsArr = req.body.skills.toUpperCase().split(';');
  skillsArr = clearSpace(skillsArr);

  const passwordHash = bcrypt.hashSync(password, 10);
  const client = new Client();

  client.connect().then(() => {
    const sql = `
      INSERT INTO usertable
        (username, passwordhash, name, avatar, email, university, job, company, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`;

    let params = [username, passwordHash, name, avatar, email, university, job, company, phone];

    params = params.map((param) => {
      if (param == '') {
        param = null;
      };
      return param;
    });

    return client.query(sql, params);
  }).then((results) => {

    const userID = results.rows[0].user_id;
    const sql = `INSERT INTO address
    (user_id, street_num, street_name, city, state_or_province, country)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const params = [userID, streetNum, streetName, city, state, country];

    return client.query(sql, params);
  }).then((results) => {
    const userID = results.rows[0].user_id;
    skillsArr.forEach((skill) => {
      findSkill(skill);
    });
    skillsArr.forEach((skill) => {
      saveSkillToUser(skill, userID);
    });
  }).then(() => {
    next();
  }).catch((err) => {
    console.log(err);
    res.redirect('/signup');
  });
},

passport.authenticate('local', {
  successRedirect: '/directory'
}));







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
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
