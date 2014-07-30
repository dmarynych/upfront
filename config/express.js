var express = require('express'),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    path = require('path'),
    config = require('../config'),
    RDBStore = require('connect-rethinkdb')(express);

module.exports = function(app, passport, rethink) {


    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.use(cookieParser('s&^hw5jk4hjkw458Y#*%Y$hjk5n4'));

    app.engine('.html', require('ejs').renderFile);

    // express/rethink session storage
    app.use(session({
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

    app.use(app.router);

    if(process.env.NODE_ENV === 'dev') {
        app.use(express.static(path.join(__dirname, '../pub_react/app')));
    }
    else {
        app.use(express.static(path.join(__dirname, '../pub_react/dist')));
    }
};