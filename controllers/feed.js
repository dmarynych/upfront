var _ = require('lodash'),
    async = require('async'),
    r = require('rethinkdb'),
    rethink = require('../rethink')/*,
    User = require('../models/User')*/;


module.exports = {
    my: function(req, res) {
        if(!req.user) {
            res.json([]);
        }
        else {
           getUser(req.user, function(err, user) {
               if(err) throw err;

               getFeed(function(doc) {
                   return r.expr(user.watches).contains(doc('repoId'));
               }, function(err, feed) {
                   if(err) throw err;

                   res.json(feed);
               });
           });
        }

    },
    all: function(req, res) {
        getFeed(null, function(err, feed) {
            if (err) throw err;

            res.json(feed);
        });
    }
};

function getUser(userId, cb) {
    rethink.r
        .table('users')
        .get(userId)
        .run(rethink.conn, cb);
}

function getFeed(criteria, callback) {
    var rq = r.table('releases')
        .orderBy({index: r.desc('releaseDate')});

    if(criteria) {
        rq = rq.filter(criteria);
    }


    rq.eqJoin('repoId', r.table('repos'))
        .zip()
        .limit(100)
        .run(rethink.conn, function(err, cursor) {
            if (err) throw err;

            cursor.toArray(callback);
        })
}
