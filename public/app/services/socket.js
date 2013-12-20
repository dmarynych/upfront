'use strict';

angular.module('up2').factory('socket', function($rootScope) {

    /*if(userName) {

        socket.on('release', function (data) {
            console.log('version bump!');
            console.log(data);

            h5Notify(data.repoUser +'/'+ data.repoName, 'New version '+ data.version);
        });
    }*/
    var user = window.userName || 'anonymous';
    var url = 'http://localhost:3001?userName='+ user;
    var socket = io.connect(url);

    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };

});