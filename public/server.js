const express = require('express');
const session = require('express-session');
const SessionStore = require('session-file-store')(session);
const passport = require('passport');
const path = require('path');

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({extended: false}));

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

require('./javascripts/passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    if(!req.isAuthenticated()) {
        return res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        return res.redirect('/notes');
    }
});

app.post('/login', (req, res, next) => {
        passport.authenticate('local', { successRedirect: '/notes',
    failureRedirect: '/login', failureFlash: true}, (err, user, info) => {
            if (err) {
                   return next(err);
            }
            if (!user) {
                return res.send('password or username invalid.');
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                    return res.redirect('/notes');
            });
        })(req, res, next);
});

var auth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/');
    }
};

app.get('/notes', auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'note.html'));
   console.log('Iam here');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`);
});