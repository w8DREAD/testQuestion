const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

var users = [
    {id: 1, username: 'admin', password: '12345'},
    {id: 2, username: 'user', password: '54321'},
    {id: 3, username: 'guest', password: '00000'}
];

passport.serializeUser( (user, done) => {
    done(null, user.id);
});

passport.deserializeUser( (id, done) => {
    var user;
    switch(id) {
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
    done(null, user);
});


passport.use(new LocalStrategy( (username, password, done) => {
    var findUser;
            for (i=0; i<users.length; i++) {
                var u = users[i];
                if (username === u.username && password === u.password) {
                    findUser = u;
                    break;
                }
            }
               if(findUser !== undefined) {
                return done(null, findUser);
            } else {
                return done(null, false);
            }

    }
));



