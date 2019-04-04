const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const authenticationMiddleware = require('./middleware');

const users = [
  {id: 1, username: 'admin', password: '12345'},
  {id: 2, username: 'user', password: '54321'},
  {id: 3, username: 'guest', password: '00000'}
];

passport.serializeUser((user, cb) => {
  cb(null, user)
});

passport.deserializeUser((user, cb) => {
  var user;
  switch (user.id) {
    case users[0].id:
      user = users[0];
      break;
    case users[1].id:
      user = users[1];
      break;
    case users[2].id:
      user = users[2];
      break;
    default:
      break;
  }
  cb(null, user);
});

const initPassport = () => {
  passport.use(new LocalStrategy((username, password, done) => {
      var findUser;
      for (i = 0; i < users.length; i++) {
        var u = users[i];
        if (username === u.username && password === u.password) {
          findUser = u;
          break;
        }
      }
      if (findUser !== undefined) {
        return done(null, findUser);
      } else {
        return done(null, false);
      }
    }
  ));

  passport.authenticationMiddleware = authenticationMiddleware
};

module.exports = initPassport;
