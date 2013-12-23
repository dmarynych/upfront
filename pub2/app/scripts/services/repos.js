'use strict';

angular.module('up2').factory('repos', function($http, $rootScope, socket) {
    var repos = {};

    repos.isMyRepo = function(repo) {
        var repoFullName = repo.user + repo.name;
        console.log(_.indexOf(app.repos, repoFullName), repoFullName);

        return _.indexOf(app.repos, repoFullName) !== -1;
    };

    socket.on('release', function (data) {
        console.log('version bump!');
        console.log(data);

        if(repos.isMyRepo(data)) {
            h5Notify(data.user +'/'+ data.name, 'New version '+ data.version);
        }
        else {
            console.log('do not notify');
        }

        $rootScope.$broadcast('newRelease', data);
    });

    repos.load = function(feedType, callback) {
        var url = '/myFeed';
        if(feedType === 'all') {
            url = '/feed';
        }

        $http.get(url)
            .success(function(data) {
                var langs = [];
                _.each(data, function(version) {
                    if(version.language && _.indexOf(langs, version.language) === -1) {
                        langs.push(version.language);
                    }
                });
                console.log([data, langs]);
                $rootScope.$broadcast('langsChanged', langs);
                callback(data, langs);
            });
    };

    var startDay = moment().startOf('day');
    var periods = [
        {
            label: 'Today',
            date: startDay
        },
        {
            label: 'Yesterday',
            date: moment(startDay).add('days', -1)
        },
        {
            label: 'Last week',
            date: moment(startDay).add('week', -1)
        },
        {
            label: 'Last month',
            date: moment(startDay).add('month', -1)
        },
        {
            label: 'Last Year',
            date: moment(startDay).add('year', -1)
        }
    ];

    repos.isNewPeriod = function(versions, index) {
        var currVersion = versions[index],
            nextVersion;

        if(index === 0) {
            return true;
        }
        if(!versions[index-1]) {
            return true;
        }

        nextVersion = versions[index-1];
        var currPeriod = _.find(periods, function(period) {
                return moment(currVersion.releaseDate) >= period.date.unix()*1000;
            }),
            prevPeriod = _.find(periods, function(period) {
                return moment(nextVersion.releaseDate) >= period.date.unix()*1000;
            });

        return !currPeriod.date.isSame(prevPeriod.date);
    };

    repos.getPeriodLabel = function(date) {
        var period = _.find(periods, function(period) {
            return date >= period.date.unix()*1000;
        });
        return period.label;
    };

    return repos;
});