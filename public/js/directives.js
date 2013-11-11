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
    }]).
    directive('fgEnter', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind("keydown keypress", function(event) {
                    if(event.which === 13) {
                        scope.$apply(function(){
                            scope.$eval(attrs.fgEnter);
                        });
                        event.preventDefault();
                    }
                });
            }
        };
    }]).
    directive('fgScroll', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element[0].scrollIntoView();
            }
        };
    }]);