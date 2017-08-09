const bcrypt = require('bcryptjs');
      mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    required: false
  },
  email: String,
  university: String,
  job: String,
  company: String,
  skills: [],
  phone: String,
  address: {
    street_num: String,
    street_name: String,
    city: String,
    state_or_province: String,
    postal_code: String,
    country: String
  }
});

userSchema.virtual('password').get(function() {
  return null;
}).set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 10);
});

userSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.statics.authenticate = function(username, password, done) {

  this.findOne({ username: username }, (err, user) => {
    if (err) {
      console.log('Error attempting to use the static authenticate function.', err);
      done(err, false);
    } else if (user) {
      console.log('Should be a successful login.', user);
      done(null, user);
    } else {
      console.log('The user probably entered the incorrect password.');
      done(null, false);
    }
  })

}

let User = mongoose.model('User', userSchema);

module.exports = User;
