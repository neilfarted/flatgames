/*jslint node:true */
/*globals angular, io */
'use strict';

angular.module('flatGames', ['ngRoute', 'flatGames.controllers', 'flatGames.services', 'flatGames.directives']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.
            /*when('/', {templateUrl: '/partials/home', controller: 'HomeCtrl', resolve: {
                id: ['LocalStorage', '$q', function (LocalStorage, $q) {
                    var d = $q.defer();
                    if (LocalStorage.get('userName')) {
                        d.resolve();
                    } else {
                        d.reject();
                    }
                    return d.promise;
                }]
            }}).*/
            when('/lobby', {templateUrl: '/partials/lobby', controller: 'LobbyCtrl', resolve: {
                init: ['Socket', 'LocalStorage', function (socket, LocalStorage) {
                    socket.emit('lobby:enter'/*, {
                        name: LocalStorage.get('userName')
                    }*/);
                }]
            }}).
            /*when('/logout', {resolve: {
                logout: ['LocalStorage', '$location', function (LocalStorage, $location) {
                    LocalStorage.remove('userName');
                    $location.path('/login');
                }]
            }}).*/
            when('/message', {templateUrl: '/partials/IM', controller: 'MessageCtrl'}).
            when('/game', {templateUrl: '/partials/game', controller: 'GameCtrl'}).
            when('/modernBrowser', {template: '<h1>This website requires the use of a modern browser.</h1>', controller: function () {}}).
            otherwise({redirectTo: '/lobby'});
    }]).run(['$rootScope', '$location', 'LocalStorage', function ($rootScope, $location, LocalStorage) {
        if (LocalStorage.che) {
            $location.path('/modernBrowser');
        }
        $rootScope.$on('$routeChangeError', function () {
            $location.path('/lobby');
        });
    }]);
