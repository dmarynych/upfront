/**
 * Module dependencies.
 */

var express = require('express'),
    user = require('./routes/user'),
    up2 = require('./routes/up2'),
    http = require('http'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    rethink = require('./rethink'),
    RDBStore = require('connect-rethinkdb')(express),
    path = require('path'),
    flash = require('connect-flash'),
    bcrypt = require('bcrypt'),
    GitHubStrategy = require('passport-github').Strategy;

var GITHUB_CLIENT_ID = "9932f5169e52393f950f";
var GITHUB_CLIENT_SECRET = "0ad1ef4180a3069a327a88c71641ac0d778cab4f";

rethink.connect(function() {
    rethink.getOne('users', {email: 'starkk@ukr.net'}, function(err, user) {
        console.log(user);
    });
});


// serialize sessions
passport.serializeUser(function (user, done) {
    console.log('serialize')
    console.log(user)
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log('serialize')
    console.log(arguments);
    done(null, id);
    /*rethink.getOne('users', {id: id}, function(err, user) {
        done(err, user);
    });*/
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


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('kekeke'));

// express/mongo session storage
app.use(express.session({
    secret: 'keke',
    store: new RDBStore({
        flushOldSessIntvl: 60000,
        clientOptions: {
            db: 'socio',
            host: 'socio.onjs.net',
            port: '28015'
        },
        table: 'session'
    })
}));


// use passport session
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')), { bufferSize: 999999 });


// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/users', user.list);
app.get('/init', up2.load);






// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
    passport.authenticate('github'),
    function(req, res){
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });



app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.post('/users/session',
    passport.authenticate('local', {
        failureRedirect: '/',
        failureFlash: 'Invalid email or password.'
    }), function (req, res) {
        res.redirect('/');
    });


app.get('/', function (req, res) {

    if (req.user) {
        res.render('main');
    }
    else {
        res.render('signin', {
            message: req.flash('error')
        });
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});