const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

function configure(passport) {
  const strategyFunc = function(username, password, done) {
    User.authenticate(username, password, function(err, user) {
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
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

module.exports = {
  configure
}
