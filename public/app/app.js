'use strict';

angular.module('up2', ['ngResource', 'ngRoute', 'repoFilters']);
angular.module('up2').run(function($rootScope, $route){
    $rootScope.$on('$routeChangeSuccess', function(currentRoute, previousRoute) {
        var nav = $('.main_menu');
        nav.find('.active').removeClass('active');
        nav.find('a[href="#/'+ $route.current.routeName +'"]').parent('li').addClass('active');
    });
});

var app = {};
$(function() {
    $.getJSON('init', function(data) {
        app = data;

        angular.bootstrap(document, ['up2']);
    });
});

function h5Notify(title, text) {
    if (window.webkitNotifications.checkPermission() === 0) { // 0 is PERMISSION_ALLOWED
        // function defined in step 2
        new Notification(title, {
            body: text
        });
    } else {
        window.webkitNotifications.requestPermission();
    }
};