var user = require('../routes/user'),
    up2 = require('../routes/up2');

module.exports = function(app, passport, rethink) {
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
};