'use strict';

angular.module('up2').controller('FilterCtrl', function($scope, $rootScope) {
    $scope.filterLanguage = [];
    $scope.languages = [];



    $scope.addLangFilter = function(lang) {
        if($scope.filterLanguage.indexOf(lang) === -1) {
            $scope.filterLanguage.push(lang);
        }
    };
    $scope.remLangFilter = function(lang) {
        $scope.filterLanguage.splice($scope.filterLanguage.indexOf(lang), 1);
    };
    $scope.isFilterActive = function(lang) {
        return $scope.filterLanguage.indexOf(lang) !== -1;
    };

    $scope.$watch('filterLanguage.length', function() {
        $rootScope.$broadcast('langsFilterChanged', $scope.filterLanguage);
    });
    $rootScope.$on('langsChanged', function(event, langs) {
        $scope.filterLanguage = [];
        $scope.languages = langs;
    });
});