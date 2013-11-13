'use strict';

angular.module('up2').controller('RepoCtrl', function($scope, Repo, $routeParams) {
    $scope.activeRoute = 'repo';
    $scope.repo = Repo.get({
        repoUser: $routeParams.repoUser,
        repoName: $routeParams.repoName
    });
});
