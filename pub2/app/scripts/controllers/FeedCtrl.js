angular.module('up2').controller('FeedCtrl', function($scope, $rootScope, repos) {
    $scope.filterLanguage = [];
    $scope.twoDaysAgoDate = moment(moment().startOf('day')).add('days', -1).unix();
    $scope.versions = [];
    $scope.currentPeriod = -1;



    $scope.isNewPeriod = function(index) {
        return repos.isNewPeriod($scope.versions, index);
    };
    $scope.getPeriodLabel = repos.getPeriodLabel;

    $scope.isToday = function(date) {
        return date > moment().startOf('day');
    };
    // calling method load of serice repos(services/repos)
    repos.load('all', function(versions, langs) {
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
