const express = require('express');
const router = express.Router();
const { Client } = require('pg');

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

  const client = new Client();

  client.connect().then(() => {
    return client.query(`
      SELECT *
        FROM usertable
        JOIN address
        ON usertable.user_id = address.user_id`);
  }).then((results) => {
    const data = { users: results.rows };
    res.render('users', data);
  }).catch((err) => {
    throw err;
  }).then(() => {
    client.end();
  });

});

router.get('/unemployed', authRequired, (req, res) => {

  const client = new Client();

  client.connect().then(() => {
    const sql = 'SELECT * FROM usertable WHERE job IS NULL';

    return client.query(sql);
  }).then((results) => {
    let data = { users: results.rows };
    console.log('RESULTS', data);
    res.render('users', data);
  }).catch(() => {
    res.redirect('/directory');
  }).then(() => {
    client.end();
  });
});

router.get('/employed', authRequired, (req, res) => {

  const client = new Client();

  client.connect().then(() => {
    const sql = 'SELECT * FROM usertable WHERE job IS NOT NULL';

    return client.query(sql);
  }).then((results) => {
    const data = { users: results.rows };
    res.render('users', data);
  }).catch(() => {
    res.redirect('/directory');
  }).then(() => {
    client.end();
  });
});

router.get('/country/:value', authRequired, (req, res) => {
  const countryValue = req.params.value;

  const client = new Client();

  client.connect().then(() => {
    const sql = `
      SELECT *
	     FROM usertable
       JOIN address
       ON usertable.user_id = address.user_id
       WHERE address.country = $1`;

    const params = [countryValue];
    console.log('COUNTRY SEARCHING FOR', countryValue);

    return client.query(sql, params);
  }).then((results) => {
    let data = { users: results.rows };
    res.render('users', data);
  }).catch((err) => {
    res.redirect('/directory');
  }).then(() => {
    client.end();
  });
});

router.get('/skills/:value', authRequired, (req, res) => {
  // let value = req.params.value;
  // User.find({ skills: value }, (err, results) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(results);
  //     let data = { users: results }
  //     res.render('users', data);
  //   };
  // });
});

router.get('/profile', authRequired, (req, res) => {
  const userID = req.session.passport.user.user_id;

  const client = new Client();

  client.connect().then(() => {
    const sql = `
      SELECT *
        FROM usertable
        JOIN address
        ON usertable.user_id = address.user_id
        WHERE usertable.user_id = $1`;
    const params = [userID];

    return client.query(sql, params);
  }).then((results) => {
    const user = results.rows[0];
    res.render('profile', user);
  }).catch((err) => {
    res.redirect('/directory');
  }).then(() => {
    client.end();
  });
});

router.get('/editprofile', authRequired, (req, res) => {

  const userID = req.session.passport.user.user_id;

  const client = new Client();

  client.connect().then(() => {
    const sql = 'SELECT * FROM usertable WHERE user_id = $1';
    const params = [userID];

    return client.query(sql, params);
  }).then((results) => {
    const user = results.rows[0];
    res.render('edit', user);
  }).catch(() => {
    res.redirect('/directory');
  }).then(() => {
    client.end();
  });
});

router.post('/editprofile', authRequired, (req, res) => {

  const userID = req.session.passport.user.user_id;
  const name = req.body.name;
  const avatar = req.body.avatarURL;
  const email = req.body.email;
  const university = req.body.university;
  const job = req.body.job;
  const company = req.body.company;
  const phone = req.body.phone;

  const client = new Client();

  client.connect().then(() => {
    const sql = `UPDATE usertable
    SET name = $1, avatar = $2, email = $3, university = $4, job = $5, company = $6, phone = $7
    WHERE user_id = $8`;
    const params = [name, avatar, email, university, job, company, phone, userID];

    return client.query(sql, params)
  }).then(() => {
    res.redirect('/profile');
  }).catch((err) => {
    console.log('ERROR UPDATING USER', err);
    res.redirect('/directory');
  }).then(() => {
    client.end();
  });

  // let skillsArr = req.body.skills.split(';');
  //   address: {
  //     street_num: req.body.street_num,
  //     street_name: req.body.street_name,
  //     city: req.body.city,
  //     state_or_province: req.body.state_or_province,
  //     country: req.body.country
  //   }
  // };
  // User.update({ _id: id }, { $set: editProfile }, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(result);
  //     res.end();
  //     // res.redirect('/profile');
  //   }
  // })
})

router.post('/delete', (req, res) => {
  const userID = req.session.passport.user.user_id;
  const client = new Client();
  req.logout();

  client.connect().then(() => {
    const sql = 'DELETE FROM usertable WHERE user_id = $1';
    const params = [userID];

    return client.query(sql, params);
  }).then(() => {
    res.redirect('/login');
  }).catch((err) => {
    console.log(err);
    res.redirect('/directory');
  }).then(() => {
    client.end();
  });
});

router.get('/messages', authRequired, (req, res) => {
  // User.find({}, (err, results) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.render('messages', { results });
  //   }
  // })
});

router.get('/writemessage/:username', authRequired, (req, res) => {
  // User.find({ username: req.params.username }, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(result[0]);
  //     res.render('writemessage', result[0]);
  //   }
  // })
});

router.post('/writemessage/:id', (req, res) => {
  // let senderUsername;
  // let formattedDate = new Date().toDateString();
  //
  // let newMessage = new Message({
  //   message: req.body.message,
  //   senderId: req.session.passport.user,
  //   recipientId: req.params.id,
  //   senderUsername: senderUsername,
  //   read: false,
  //   createdAt: formattedDate
  // });
  //
  // Message.create(newMessage, (err, message) => {
    // if (err) {
    //   console.log(err);
    //   res.redirect('/inbox');
    // } else {
    //   console.log(message);
    //
    //   User.findById(req.session.passport.user, (err, user) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log('SENDER=============================================================================================', user.username);
    //       senderUsername = user.username;
    //       User.findById(req.params.id, (error, result) => {
    //         console.log('SENDERUSERNAME=================================================================================', senderUsername);
    //         if (error) {
    //           console.log(error);
    //         } else {
    //           let formattedDate = new Date().toDateString();
    //           let newMessage = new Message({
    //             message: req.body.message,
    //             senderId: req.session.passport.user,
    //             senderUsername: senderUsername,
    //             read: false,
    //             createdAt: formattedDate
    //           });
    //           result.messages.unshift(newMessage);
    //           console.log('RESULT====================================', result);
    //           let inbox = result.messages;
    //           User.update({ _id: req.params.id }, { $set: { messages: inbox }}, (err, update) => {
    //             if (err) {
    //               console.log(err);
    //             } else {
    //               res.redirect('/directory');
    //             }
    //           });
    //         }
    //       })
    //     }
    //   });
    // };
  // });


});

router.get('/inbox', authRequired, (req, res) => {
  // User.findById(req.session.passport.user, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log('DATA=================================================================', result);
  //     res.render('inbox', result);
  //   };
  // });
});

router.get('/:id', authRequired, (req, res) => {
  const userID = req.session.passport.user.user_id;
  const id = req.params.id;
  if (id == userID) {
    res.redirect('/profile');
  } else {
    const client = new Client();

    client.connect().then(() => {
      const sql = `
        SELECT *
          FROM usertable
          JOIN address
          ON usertable.user_id = address.user_id
          WHERE usertable.user_id = $1`;
      const params = [id];

      return client.query(sql, params);
    }).then((results) => {
      const user = results.rows[0];
      res.render('user', user);
    }).catch((err) => {
      console.log(err);
      res.redirect('/directory');
    }).then(() => {
      client.end();
    });
  };
});

router.post('/readmessage/:id', (req, res) => {
  // let messageID = req.params.id;
  // Message.getByIdAndUpdate(messageID, { $set: { read: true } }, (err, result) => {
  //   if (err) {
  //     throw err;
  //   } else {
  //     res.json(result);
  //   };
  // });
});

router.get('/readmessage/:id', authRequired, (req, res) => {
  let messageID = req.params.id;

  // function markAsRead(id) {
  //   Message.getByIdAndUpdate(id, { $set: { read: true } }, (err, result) => {
  //     if (err) {
  //       throw err;
  //     } else {
  //       res.render()
  //     }
  //   });
  // };

  // User.findById(req.session.passport.user, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log('DATA=================================================================', result);
  //     result.messages.forEach((message) => {
  //       if (message._id === messageID) {
  //         message.read = true;
  //       };
  //     });
  //     result.save((error) => {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log('RESULT', result);
  //         res.send('message');
  //       }
  //     })
  //   };
  // });

  // Message.update({ _id: messageID }, { $set: { read: true }}, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //     res.redirect('/inbox');
  //   } else {
      // Message.findById(messageID, (error, message) => {
      //   if (error) {
      //     console.log(error);
      //     res.redirect('/inbox');
      //   } else {
      //     console.log('THE MESSAGE IS', message);
      //     console.log('THE ID IS', messageID);
      //     res.send('message');
      //   }
      // });
  //   }
  // });
});

module.exports = router;
