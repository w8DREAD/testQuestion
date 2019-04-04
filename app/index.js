const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const SessionStore = require('session-file-store')(session);
const hbs = require('hbs');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

require('./authentication').init(app);

//создание сессии
app.use(
  session({
    secret: 'secretword',
    store: new SessionStore(),
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 1000 * 60 * 30
    },
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname),
  partialsDir: path.join(__dirname + "/partials")
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname));

require('./user').init(app);
require('./note').init(app);

module.exports = app;
