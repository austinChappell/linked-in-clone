const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const checkPassword = function(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
};

const checkUser = function(username, password, done) {
  const client = new Client();

  client.connect().then(() => {

    const sql = 'SELECT * FROM usertable WHERE username = $1';
    const params = [username];

    return client.query(sql, params);
  }).then((results) => {
      console.log('RESULTS', results.rows);
      const user = results.rows[0];

      if (user && checkPassword(password, user.passwordhash)) {
      console.log('Should be a successful login.', user);
      done(null, user);
    } else {
      console.log('The user probably entered the incorrect password.');
      done(null, false);
    };
  });
};

module.exports = { checkUser }
