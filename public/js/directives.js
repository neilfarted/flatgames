/*jslint node:true */
/*globals angular, io */
'use strict';

angular.module('flatGames.directives', []).
    directive('fgLogin', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/partials/login'
        };
    }]);