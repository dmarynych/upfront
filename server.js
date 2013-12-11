/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    config = require('./config'),
    passport = require('passport'),
    rethink = require('./rethink'),
    async = require('async');

var app = express();

console.log(config.get('rethink'))

rethink.connect(function() {
    require('./config/passport')(passport, rethink);
    require('./config/express')(app, passport, rethink);
    require('./config/routes')(app, passport, rethink);


    http.createServer(app).listen(app.get('port'), function () {
        console.log('Server started and listening on port ' + app.get('port'));
    });
});




