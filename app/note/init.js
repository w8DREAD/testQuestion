const passport = require('passport');

var initUser = (app) => {
  app.get('/notes', passport.authenticationMiddleware(), (req, res) => {
    res.render('note/list', {
      username: ', ' + req.user.username
    })
  })
};

module.exports = initUser;
