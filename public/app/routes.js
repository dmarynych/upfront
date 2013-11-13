'use strict';

angular.module('up2').config(['$routeProvider', function($routeProvider, $scope) {
    $routeProvider.
        when('/settings', {
            routeName: 'settings',
            templateUrl: 'app/views/main.html',
            controller: 'ReposCtrl'
        }).
        when('/repo/:repoUser/:repoName', {
            routeName: 'repo',
            templateUrl: 'app/views/repo.html',
            controller: 'RepoCtrl'
        }).
        when('/feed', {
            routeName: 'feed',
            templateUrl: 'app/views/feed.html',
            controller: 'FeedCtrl'
        }).
        when('/myFeed', {
            routeName: 'myFeed',
            templateUrl: 'app/views/feed.html',
            controller: 'MyFeedCtrl'
        }).
        when('/status', {
            routeName: 'status',
            templateUrl: 'app/views/status.html',
            controller: 'StatusCtrl'
        }).
        otherwise({redirectTo: '/feed'});

}]);