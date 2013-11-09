/*jslint node:true */
/*globals angular, io */
'use strict';

angular.module('flatGames', ['ngRoute', 'flatGames.controllers', 'flatGames.services']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.
            when('/', {templateUrl: '/partials/home', controller: 'HomeCtrl'}).
            when('/login', {templateUrl: '/partials/login', controller: 'LoginCtrl'}).
            when('/logout', {resolve: {
                logout: ['User', '$location', function (User, $location) {
                    User.logout();
                    $location.path('/login');
                }]
            }}).
            when('/message', {templateUrl: '/partials/IM', controller: 'MessageCtrl'}).
            when('/game', {templateUrl: '/partials/game', controller: 'GameCtrl'}).
            otherwise({redirectTo: '/'});
    }]);
