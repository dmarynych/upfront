var fbug = console.log,
    config = require('./config'),
    r = require('rethinkdb');


var rethink = {
    conn: null,
    r: r,
    host: config.get('rethink:host'),
    port: config.get('rethink:port'),
    user: config.get('rethink:user'),
    db: config.get('rethink:db'),
    password: config.get('rethink:password'),


    connect: function(cb) {
        r.connect({ host: this.host, port: this.port, db: this.db }, function(err, conn) {
            if(err) {
                throw err;
            }

            this.conn = conn;

            cb(null, conn);
        }.bind(this));
    },

    getAll: function(table, cond, cb) {
        r.db(this.db).table(table).filter(cond).run(this.conn, function(err, cursor) {
            if (err) {
                throw err;
            }

            cursor.toArray(function(err, result) {
                if (err) {
                    throw err;
                }

                cb(null, result);
            });
        });
    },
    getOne: function(table, cond, cb) {
        r.db(this.db).table(table).filter(cond).run(this.conn, function(err, cursor) {
            if (err) {
                throw err;
            }

            cursor.toArray(function(err, result) {
                if (err) {
                    throw err;
                }

                cb(null, result[0]);
            });
        });
    },
    insert: function(table, data, cb) {
        r.db(this.db)
            .table(table)
            .insert(data)
            .run(this.conn, function(err, result) {
                var generatedId = result.generated_keys[0];
                cb(null, result, generatedId);
            });
    }
};

module.exports = rethink;