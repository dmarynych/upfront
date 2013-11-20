/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    config = require('./config'),
    passport = require('passport'),
    rethink = require('./rethink');

rethink.connect(function() {

});

var app = express();

require('./config/passport')(passport, rethink);
require('./config/express')(app, passport, rethink);
require('./config/routes')(app, passport, rethink);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});