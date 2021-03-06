const LocalStrategy = require('passport-local').Strategy;
const { Client } = require('pg');

const User = require('./models/user');

function configure(passport) {
  const strategyFunc = function(username, password, done) {
    User.checkUser(username, password, function(err, user) {
      if (err) {
        console.log('Local Strategy - Error trying to authenticate');
        done(err);
      } else if (user) {
        console.log('Local Strategy - Success');
        done(null, user)
      } else {
        console.log('Local Strategy - Could not find the user');
        done(null, false);
      };
    });
  };
  passport.use(new LocalStrategy(strategyFunc));
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    const userID = user.user_id;
    const client = new Client();

    client.connect().then(() => {
      const sql = 'SELECT * FROM usertable WHERE user_id = $1';
      const params = [userID];

      return client.query(sql, params);
    }).then((results) => {
      const user = results.rows[0];
      done(null, user);
    }).catch((err) => {
      throw err;
    }).then(() => {
      client.end();
    });
  });
};

module.exports = {
  configure
}
