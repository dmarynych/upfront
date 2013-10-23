
var async = require('async');
var rethink = require('../rethink');



 exports.load = function(req, res){

     async.parallel([
         function(cb){
             rethink.getOne('worlds', {id: req.user.worldId}, function(err, res) {
                 cb(err, res);
             });
         },
         function(cb){
             rethink.getAll('entities', {worldId: req.user.worldId}, function(err, res) {
                 cb(err, res);
             });
         }
     ],
     // optional callback
     function(err, results){
         res.json(
             {
                 world: results[0],
                 entities: results[1]
             }
         );
         // the results array will equal ['one','two'] even though
         // the second function had a shorter timeout.
     });


};