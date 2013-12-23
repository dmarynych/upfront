'use strict';

angular.module('up2').config(['$routeProvider', function($routeProvider, $scope) {
    $routeProvider.
        when('/settings', {
            routeName: 'settings',
            templateUrl: 'views/main.html',
            controller: 'ReposCtrl'
        }).
        when('/repo/:repoUser/:repoName', {
            routeName: 'repo',
            templateUrl: 'views/repo.html',
            controller: 'RepoCtrl'
        }).
        when('/feed', {
            routeName: 'feed',
            templateUrl: 'views/feed.html',
            controller: 'FeedCtrl'
        }).
        when('/myFeed', {
            routeName: 'myFeed',
            templateUrl: 'views/feed.html',
            controller: 'MyFeedCtrl'
        }).
        when('/status', {
            routeName: 'status',
            templateUrl: 'views/status.html',
            controller: 'StatusCtrl'
        }).
        otherwise({redirectTo: '/feed'});

}]);