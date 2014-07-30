'use strict';

angular.module('up2').controller('ReposCtrl', function($scope, $http, Repo) {
    $scope.activeRoute = 'settings';
    $scope.sortRepos = function() {
        console.log(this.lang.name);
        //$scope.lang = this.lang.name;
    };

    //console.log(Repo.query());

    $scope.check = function(key) {
        var repo = $scope.repos[key];
        console.log([key, repo.name, repo.notifyDaily, repo.notifyInstant]);


        repo.$saveChanges();
    };

    $scope.isPage = function (url) {
        return url ===  $scope.activeRoute;
    };

    $scope.filterLanguages = {'PHP': true};

    $scope.getLangIcon = function(lang) {
        var langs = {
            'JavaScript': 'js.png',
            'Ruby': 'ruby.png',
            'Python': 'python.png',
            'PHP': 'php.png',
            'Java': 'java.png'
        };
        return langs[lang] ? langs[lang] : 'none';
    };

    //$scope.lang = 'all';


    $scope.repos = Repo.query(function(data) {
        $scope.data = data;
        console.log(data);
        //$('.switch').bootstrapSwitch();
        //$('select').chosen();
    });
});