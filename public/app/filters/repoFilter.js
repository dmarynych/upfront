'use strict';

angular.module('repoFilters', [])
.filter('reposFilter', function () {
    return function (versions) {
        var ret = [];
        angular.forEach(versions, function (version, key) {
            if(this.filterLanguage.length === 0) {
                ret.push(version);
            }
            else {
                if (_.indexOf(this.filterLanguage, version.language) !== -1) {
                    ret.push(version);
                }
            }
        }, this);

        return ret;

    };
});