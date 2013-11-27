var _ = require('lodash'),
    async = require('async'),
    r = require('rethinkdb'),
    rethink = require('../rethink');


module.exports = {
    my: function(req, res) {
        rethink.getOne('users', {githubId: req.user}, function(err, user) {
            if(user) {
                getFeed({}, function(err, feed) {
                    if (err) throw err;

                    res.json(feed);
                });
            }
        });
    },
    all: function(req, res) {
        getFeed({}, function(err, feed) {
            if (err) throw err;

            res.json(feed);
        });
    }
};


function getFeed(criteria, callback) {
    r.db('uptodater').table('releases')
        //.filter(criteria)
        .orderBy({index: r.desc('releaseDate')})
        .eqJoin('repoId', r.db('uptodater').table('repos'))
        .zip()
        .limit(10)
        .run(rethink.conn, function(err, cursor) {
            if (err) throw err;

            cursor.toArray(callback);
        })
}
