'use strict';


angular.module('up2').controller('MyFeedCtrl', function($scope, $rootScope, versions) {
    $scope.filterLanguage = [];
    $scope.twoDaysAgoDate = moment(moment().startOf('day')).add('days', -1).unix();
    $scope.versions = [];
    $scope.currentPeriod = -1;



    $scope.isNewPeriod = function(index) {
        return versions.isNewPeriod($scope.versions, index);
    };
    $scope.getPeriodLabel = versions.getPeriodLabel;

    $scope.isToday = function(date) {
        return date > moment().startOf('day');
    };
    versions.load('my', function(periods, langs) {
        $scope.languages = langs;
        $scope.versions = periods;
    });

    $rootScope.$on('langsFilterChanged', function(event, filterLanguage) {
        $scope.filterLanguage = filterLanguage;
    });

    $rootScope.$on('newRelease', function(event, version) {
        console.log('nr', version);

        if(versions.isMyRepo(version)) {
            $scope.versions.unshift(version);
        }
    });
});
