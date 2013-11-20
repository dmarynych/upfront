var express = require('express'),
    flash = require('connect-flash'),
    path = require('path'),
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
    app.use(express.cookieParser('kekeke'));

// express/mongo session storage
    app.use(express.session({
        secret: 'keke',
        store: new RDBStore({
            flushOldSessIntvl: 60000,
            clientOptions: {
                db: 'socio',
                host: 'socio.onjs.net',
                port: '28015'
            },
            table: 'session'
        })
    }));


// use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, '../public')), { bufferSize: 999999 });


// development only
    if ('development' === app.get('env')) {
        app.use(express.errorHandler());
    }
};