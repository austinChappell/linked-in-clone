const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      flash = require('express-flash-messages'),
      mongoose = require('mongoose'),
      mustacheExpress = require('mustache-express'),
      passport = require('passport'),
      session = require('express-session');

mongoose.connect('mongodb://localhost:27017/robots', {
  useMongoClient: true
});

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'asdfhqgiohalkj',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
require('./passportconfig').configure(passport);
app.use(flash());

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/general'));

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.listen(3000, function() {
  console.log(`Your server has started on PORT 3000`);
});
