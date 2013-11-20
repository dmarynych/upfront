var LocalStrategy = require('passport-local').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    bcrypt = require('bcrypt');

var GITHUB_CLIENT_ID = "9932f5169e52393f950f";
var GITHUB_CLIENT_SECRET = "0ad1ef4180a3069a327a88c71641ac0d778cab4f";


module.exports = function(passport, rethink) {
    // serialize sessions
    passport.serializeUser(function (githubUser, done) {
        console.log('serialize');

        rethink.getOne('users', {githubId: githubUser.id}, function(err, user) {
            // if user exists in db
            if(user) {
                console.log('user exists');
                done(null, githubUser.id);
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
                rethink.insert('users', userObj, function(res) {
                    done(null, githubUser.id);
                });
            }
        });


    });

    passport.deserializeUser(function (id, done) {
        done(null, id);
    });


    passport.use(new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {

                // To keep the example simple, the user's GitHub profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the GitHub account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));





    // use local strategy
    passport.use(new LocalStrategy(
        function (email, password, done) {
            rethink.getOne('users', {email: email}, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }

                if (bcrypt.compareSync(user.password, password)) {
                    return done(null, false, { message: 'Invalid password' });
                }

                return done(null, user);
            });
        }
    ));
};