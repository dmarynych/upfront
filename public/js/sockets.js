var sockets = {
    init: function() {

        this.socket = io.connect('http://localhost:3001');
        this.socket.on('walk', function (data) {
            fbug('socket m');
            fbug(_.clone(data));
            //ggame.entities.get(data.entityId).walkToPath(data.path);
        });

        /*this.socket.on('entity', function (data) {
            fbug('socket e');
            fbug(_.clone(data));
            ggame.entities.add(data);
        });*/

        this.socket.on('entity', function (data) {
            fbug('socket a');
            fbug(_.clone(data));
            ggame.entities.get(data.entityId).set(data);
        });

    }
};


