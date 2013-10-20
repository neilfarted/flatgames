/*jslint node:true */
/*globals angular */
'use strict';

angular.module('flatGames', []).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.
            when('/', {templateUrl: '/partials/home', controller: 'HomeCtrl'}).
            otherwise({redirectTo: '/'});
    }]).
    controller('HomeCtrl', ['$scope', 'Socket', function ($scope, socket) {
        $scope.messages = [];
        socket.on('init', function (data) {
            $scope.name = data.name;
            $scope.users = data.users;
        });

        socket.on('send:message', function (message) {
            $scope.messages.push(message);
        });

        socket.on('change:name', function (data) {
            changeName(data.oldName, data.newName);
        });

        socket.on('user:join', function (data) {
            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + data.name + ' has joined.'
            });
            $scope.users.push(data.name);
        });

        // add a message to the conversation when a user disconnects or leaves the room
        socket.on('user:left', function (data) {
            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + data.name + ' has left.'
            });
            var i, user;
            for (i = 0; i < $scope.users.length; i++) {
                user = $scope.users[i];
                if (user === data.name) {
                    $scope.users.splice(i, 1);
                    break;
                }
            }
        });

        // Private helpers
        // ===============

        var changeName = function (oldName, newName) {
            // rename user in list of users
            var i;
            for (i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i] === oldName) {
                    $scope.users[i] = newName;
                }
            }

            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + oldName + ' is now known as ' + newName + '.'
            });
        }

        // Methods published to the scope
        // ==============================

        $scope.changeName = function () {
            socket.emit('change:name', {
                name: $scope.newName
            }, function (result) {
                if (!result) {
                    alert('There was an error changing your name');
                } else {

                    changeName($scope.name, $scope.newName);

                    $scope.name = $scope.newName;
                    $scope.newName = '';
                }
            });
        };

        $scope.sendMessage = function () {
            socket.emit('send:message', {
                message: $scope.message
            });

            // add the message to our model locally
            $scope.messages.push({
                user: $scope.name,
                text: $scope.message
            });

            // clear message box
            $scope.message = '';
        };

        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
            // or something like
            // socket.removeListener(this);
        });
    }]).
    factory('LocalStorage', ['$window', function ($window) {
        var checkLocalStorage = function () {
            try {
                return $window.hasOwnProperty('localStorage') && $window.localStorage !== null;
            } catch (e) {
                return false;
            }
        }, hasLocalStorage = checkLocalStorage(), store = $window.localStorage;

        return {
            get: function (key) {
                if (hasLocalStorage && store.hasOwnProperty(key)) {
                    return JSON.parse(store[key]);
                }
                return null;
            },
            set: function (key, value) {
                if (hasLocalStorage) {
                    store[key] = JSON.stringify(value);
                    return true;
                }
                return null;
            },
            remove: function (key) {
                if (hasLocalStorage) {
                    if (store.hasOwnProperty(key) && store[key] !== null) {
                        store.removeItem(key);
                        return true;
                    }
                    return false;
                }
                return null;
            }
        };
    }]).
    factory('Socket', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        var sock = io.connect();
        return {
            on: function (event, callback) {
                sock.on(event, function () {
                    var args = arguments;
                    $timeout(function () {
                        callback.apply(sock, args);
                    }, 0);
                });
            },
            emit: function (event, data, callback) {
                sock.emit(event, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(sock, args);
                        }
                    });
                });
            }
        };
    }]);