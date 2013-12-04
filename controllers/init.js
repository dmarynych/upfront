var _ = require('lodash'),
    async = require('async'),
    r = require('rethinkdb'),
    rethink = require('../rethink');


module.exports = function(req, res) {
    if(req.user) {
        getUserRepos(req.user, function(user, repos) {
            if(user && repos) {
                res.json({
                    user: {
                        username: user.username,
                        githubId: user.githubId,
                        displayname: user.displayName,
                        id: user.id
                    },
                    repos: repos
                });
            }
            else {
                res.json({
                    user: null,
                    repos: []
                });
            }

        });
    }
    else {
        res.json({
            user: null,
            repos: []
        });
    }

};

function getUserRepos(userId, callback) {
    rethink.r
        .table('users')
        .get(userId)
        .run(rethink.conn, function(err, user) {
            if(user) {
                r.db('uptodater').table('repos')
                    .filter(function (repo) { return r.expr(user.watches).contains(repo('id')) })
                    .map(function(repo) {
                        return repo('user').add('/').add(repo('name'));
                    })
                    .run(rethink.conn, function(err, cursor) {
                        cursor.toArray(function(err, repos) {
                            if (err) throw err;

                            callback(user, repos);
                        });
                    });
            }
            else {
                callback(null, null);
            }
        });
}