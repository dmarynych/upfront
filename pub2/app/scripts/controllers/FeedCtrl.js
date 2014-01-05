angular.module('up2').controller('FeedCtrl', function($scope, $rootScope, versions) {
    $scope.filterLanguage = [];
    $scope.twoDaysAgoDate = moment(moment().startOf('day')).add('days', -1).valueOf();
    $scope.versions = [];
    $scope.currentPeriod = -1;



    $scope.isNewPeriod = function(index) {
        return versions.isNewPeriod($scope.versions, index);
    };
    $scope.getPeriodLabel = versions.getPeriodLabel;

    $scope.isToday = function(date) {
        return date > moment().startOf('day');
    };
    // calling method load of serice repos(services/repos)
    versions.load('all', function(versions, langs) {
        $scope.languages = langs;
        $scope.versions = versions;
    });

    $rootScope.$on('langsFilterChanged', function(event, filterLanguage) {
        $scope.filterLanguage = filterLanguage;
    });

    $rootScope.$on('newRelease', function(event, version) {
        console.log('nr', version);
        $scope.versions.unshift(version);
    });
});
