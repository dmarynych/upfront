var express = require('express'),
    flash = require('connect-flash'),
    path = require('path'),
    config = require('../config'),
    RDBStore = require('connect-rethinkdb')(express);

module.exports = function(app, passport, rethink) {
    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('s&^hw5jk4hjkw458Y#*%Y$hjk5n4'));

    // express/rethink session storage
    app.use(express.session({
        secret: 'keke',
        store: new RDBStore({
            flushOldSessIntvl: 60000,
            clientOptions: {
                host: config.get('rethink:host'),
                port: config.get('rethink:port'),
                db: config.get('rethink:db')
            },
            table: 'session'
        })
    }));




    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, '../public')));

    /*if ('development' === app.get('env')) {
        app.use(express.errorHandler());
    }*/
};