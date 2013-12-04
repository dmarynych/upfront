var LocalStrategy = require('passport-local').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    bcrypt = require('bcrypt'),
    config = require('../config');

module.exports = function(passport, rethink) {
    passport.serializeUser(function (githubUser, done) {
        console.log('serialize');

        rethink.getOne('users', {githubId: githubUser.id}, function(err, user) {
            if(user) {
                done(null, user.id);
            }
            else {
                console.log('user not found, inserting');
                var userObj = {
                    githubId: githubUser.id,
                    username: githubUser.username,
                    displayName: githubUser.displayName,
                    watches: [],
                    email: null
                };
                if(githubUser.emails && githubUser.emails.length > 0 && githubUser.emails[0].value) {
                    userObj.email = githubUser.emails[0].value;
                }

                rethink.insert('users', userObj, function(err, res, userId) {
                    done(null, userId);
                });
            }
        });


    });

    passport.deserializeUser(function (id, done) {
        //console.log('deserialize');
        done(null, id);
    });


    passport.use(new GitHubStrategy({
            clientID: config.get('github:client_id'),
            clientSecret: config.get('github:client_secret')
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(done)
            process.nextTick(function () {
                return done(null, profile);
            });
        }
    ));
};