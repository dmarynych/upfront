'use strict';

angular.module('up2').controller('StatusCtrl', function($scope, socket) {
    $scope.usersOnline = 0;
    $scope.totalRepos = app.totalRepos;

    socket.on('usersOnline', function (data) {
        $scope.usersOnline = data;
    });

    socket.on('githubLimit', function (data) {
        $scope.githubLimit = JSON.parse(data);
    });
});
