var _ = require('lodash'),
    async = require('async'),
    r = require('rethinkdb'),
    rethink = require('../rethink')/*,
    User = require('../models/User')*/;


module.exports = {
    my: function(req, res) {
        //User.get()
        rethink.r
            .table('users')
            .get(req.user)
            .run(rethink.conn, function(err, user) {
                if(user) {
                    getFeed(function(doc) {
                        return r.expr(user.watches).contains(doc('repoId'));
                    }, function(err, feed) {
                        if(err) throw err;

                        res.json(feed);
                    });
                }
                else {
                    res.json([]);
                }
            });
    },
    all: function(req, res) {
        getFeed(null, function(err, feed) {
            if (err) throw err;

            res.json(feed);
        });
    }
};


function getFeed(criteria, callback) {
    var rq = r.table('releases')
        .orderBy({index: r.desc('releaseDate')});

    if(criteria) {
        rq = rq.filter(criteria);
    }


    rq.eqJoin('repoId', r.table('repos'))
        .zip()
        .limit(10)
        .run(rethink.conn, function(err, cursor) {
            if (err) throw err;

            cursor.toArray(callback);
        })
}
