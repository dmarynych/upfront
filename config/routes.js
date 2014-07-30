var user = require('../routes/user'),
    init = require('../controllers/init'),
    feed = require('../controllers/feed');

module.exports = function(app, passport, rethink) {
    app.get('/', function (req, res) {
        if(process.env.NODE_ENV === 'dev') {
            res.render('../pub_react/app/index.html');
        }
        else {
            res.render('../pub_react/dist/index.html');
        }
    });

    app.get('/feed/my', feed.my);
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
};