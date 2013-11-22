var _ = require('lodash'),
    async = require('async'),
    r = require('rethinkdb'),
    rethink = require('../rethink');


module.exports = {
    my: function(req, res) {
        rethink.getOne('users', {githubId: req.user}, function(err, user) {
            if(user) {
                r.db('uptodater').table('repos')
                    .filter(function (repo) { return r.expr(user.watches).contains(repo('id')) })
                    /*.map(function(repo) {
                        return repo('user').add('/').add(repo('name'));
                    })*/
                    .run(rethink.conn, function(err, cursor) {
                        cursor.toArray(function(err, repos) {
                            if (err) throw err;

                            res.json(repos);
                        });
                    });
            }
        });
    }
};
