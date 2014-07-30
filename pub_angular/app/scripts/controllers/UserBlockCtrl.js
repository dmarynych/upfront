'use strict';

angular.module('up2').controller('UserBlockCtrl', function($scope, $rootScope) {
    $scope.user = app.user;
    $scope.isAuth = !!app.user;
});