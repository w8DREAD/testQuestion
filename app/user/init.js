const passport = require('passport');

var initUser = (app) => {
  app.get('/', (req, res) => {
      if(!req.isAuthenticated()) {
        renderLogin(req, res);
      } else {
        res.redirect('/notes')
      }
  });
  app.get('/profile', passport.authenticationMiddleware(), renderProfile);
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/'
  }));
  app.post('/logout', passport.authenticationMiddleware(), (req, res) => {
    req.logout();
    res.redirect('/');
  });
};

var renderLogin = (req, res) => {
  res.render('user/login')
};

var renderProfile = (req, res) => {
  res.render('user/profile', {
    username: req.user.username
  })
};

module.exports = initUser;
