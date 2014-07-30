angular.module('up2')
    .factory('Repo', function($resource){
        'use strict';

        return $resource('repos/:id/:repoUser/:repoName', {}, {
            query: {method:'GET', isArray:true},
            saveChanges: {
                method:'POST',
                params:{id:'@id'}
            }
        });
    });