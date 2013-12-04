/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    config = require('./config'),
    passport = require('passport'),
    rethink = require('./rethink'),
    async = require('async')/*,
    thinky = require('thinky')*/;

var app = express();
/*thinky.init({
    host: config.get('rethink:host'),
    port: config.get('rethink:port'),
    db: config.get('rethink:db')
});*/


rethink.connect(function() {
    require('./config/passport')(passport, rethink);
    require('./config/express')(app, passport, rethink);
    require('./config/routes')(app, passport, rethink);


    http.createServer(app).listen(app.get('port'), function () {
        console.log('Server started and listening on port ' + app.get('port'));
    });
});




