const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Message = require('../models/message');

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
  User.findById(req.session.passport.user, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      req.session.messageArray = result.messages;
    }
  })
  console.log('USER=======================', req.session);
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      console.log('MESSAGES', req.session.messageArray);
      let data = { users };
      if (req.session.messageArray.length > 0) {
        data.userMessages = true;
      } else {
        data.userMessages = false;
      }
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
      result.skills = result.skills.join('; ');
      console.log(result);
      res.render('edit', {result});
    };
  });
});

router.post('/editprofile', authRequired, (req, res) => {
  let id = req.session.passport.user;
  let skillsArr = req.body.skills.split(';');
  const editProfile = {
    name: req.body.name,
    avatar: req.body.avatarURL,
    email: req.body.email,
    university: req.body.university,
    job: req.body.job,
    company: req.body.company,
    skills: skillsArr,
    phone: req.body.phone,
    address: {
      street_num: req.body.street_num,
      street_name: req.body.street_name,
      city: req.body.city,
      state_or_province: req.body.state_or_province,
      country: req.body.country
    }
  };
  User.update({ _id: id }, { $set: editProfile }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.end();
      // res.redirect('/profile');
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
});

router.get('/messages', authRequired, (req, res) => {
  User.find({}, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.render('messages', { results });
    }
  })
});

router.get('/writemessage/:username', authRequired, (req, res) => {
  User.find({ username: req.params.username }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result[0]);
      res.render('writemessage', result[0]);
    }
  })
});

router.post('/writemessage/:id', (req, res) => {
  let senderUsername;
  User.findById(req.session.passport.user, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log('SENDER=============================================================================================', user.username);
      senderUsername = user.username;
      User.findById(req.params.id, (error, result) => {
        console.log('SENDERUSERNAME=================================================================================', senderUsername);
        if (error) {
          console.log(error);
        } else {
          let formattedDate = new Date().toDateString();
          let newMessage = new Message({
            message: req.body.message,
            senderId: req.session.passport.user,
            senderUsername: senderUsername,
            read: false,
            createdAt: formattedDate
          });
          result.messages.unshift(newMessage);
          console.log('RESULT====================================', result);
          let inbox = result.messages;
          User.update({ _id: req.params.id }, { $set: { messages: inbox }}, (err, update) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/directory');
            }
          });
        }
      })
    }
  });
});

router.get('/inbox', authRequired, (req, res) => {
  User.findById(req.session.passport.user, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('DATA=================================================================', result);
      res.render('inbox', result);
    };
  });
});

router.get('/:id', authRequired, (req, res) => {
  if (req.params.id == req.session.passport.user) {
    res.redirect('/profile');
  } else {
    User.findById(req.params.id, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(results);
        res.render('user', results);
      };
    });
  }
});

router.post('/readmessage/:id', authRequired, (req, res) => {
  Message.update({ _id: req.params.id }, { $set: { read: true }});
});

module.exports = router;
