var user = require('../routes/user'),
    init = require('../controllers/init'),
    feed = require('../controllers/feed');

module.exports = function(app, passport, rethink) {
    app.get('/', function (req, res) {
        res.render('../pub2/app/index.html');
    });

    app.get('/myFeed', feed.my);
    app.get('/feed', feed.all);
    app.get('/init', init);




    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
    /*app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/',
            failureFlash: 'Invalid email or password.'
        }), function (req, res) {
            res.redirect('/');
        });*/
};