
var async = require('async');
var rethink = require('../rethink');



 exports.load = function(req, res){

     /*async.parallel([
         function(cb){
             rethink.getOne('repos', {id: req.user.worldId}, function(err, res) {
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

         // the results array will equal ['one','two'] even though
         // the second function had a shorter timeout.
     });*/

     res.json(
         {
             repos: ['jquery/jquery'],
             totalRepos: 1
         }
     );
};