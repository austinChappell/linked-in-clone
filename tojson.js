const data = require('./data');

// console.log(data.users);
data.users.forEach(function(user) {
  console.log(JSON.stringify(user));
});
