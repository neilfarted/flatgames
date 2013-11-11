/*jslint node:true */
/*globals angular, io */
'use strict';

angular.module('flatGames.controllers', []).
    controller('HomeCtrl', ['$scope', 'Socket', 'LocalStorage', function ($scope, socket, LocalStorage) {
        $scope.userName = LocalStorage.get('userName');
    }]).
    /*controller('LoginCtrl', ['$scope', 'Socket', '$location', function ($scope, socket, $location) {
        $scope.messages = [];
        $scope.submit = function () {
            socket.emit('user:login', {
                name: $scope.user.name
            });
            $location.path('/lobby');
        };
        socket.on('send:message', function (message) {
            console.log(message);
            $scope.messages.push(message);
        });
        //socket.on()
    }]).*/
    controller('LobbyCtrl', ['$scope', 'Socket', 'LocalStorage', '$timeout', function ($scope, socket, LocalStorage, $timeout) {
        $scope.loggedIn = LocalStorage.get('UserName');
        $scope.logout = function () {
            socket.emit('logout');
            LocalStorage.remove('UserName');
            $scope.loggedIn = false;
        };
        $scope.users = [];
        $scope.messages = [];
        $scope.submit = function () {
            socket.emit('user:login', {
                name: $scope.user.name
            });
        };
        socket.on('login:success', function (data) {
            $scope.showLogin = false;
            LocalStorage.set('UserName', data.name);
            $scope.loggedIn = data.name;
        });
        socket.on('lobby:init', function (data) {
            $scope.users = data.users;
        });
        socket.on('lobby:join', function (data) {
            var index = $scope.messages.push({text: data.user.name + ' has joined the lobby.'}) - 1;
            $scope.users.push(data.user);
            $timeout(function () {
                $scope.messages.splice(index, 1);
            }, 3000);
        });
        socket.on('lobby:leave', function (data) {
            var index = $scope.messages.push({text: data.name + ' has left the lobby.'}) - 1;
            $scope.users = data.users;
            $timeout(function () {
                $scope.messages.splice(index, 1);
            }, 3000);
        });
    }]).
    controller('GameCtrl', ['$scope', 'Socket', function ($scope, socket) {
        socket.on('init', function (data) {
            $scope.turn = data.players > 1;
            $scope.u_id = data.players;
        });

        socket.on('get:tag', function (data) {
            $scope.turn = data.id === $scope.u_id;
        });

        $scope.passTag = function () {
            socket.emit('pass:tag', {
                id: $scope.u_id
            });
        };

        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
            // or something like
            // socket.removeListener(this);
        });
    }]).
    controller('MessageCtrl', ['$scope', 'Socket', function ($scope, socket) {
        function changeName(oldName, newName) {
            // rename user in list of users
            var i;
            if (-1 < (i = $scope.users.indexOf(oldName))) {
                $scope.users[i] = newName;
                $scope.messages.push({
                    user: 'chatroom',
                    text: 'User ' + oldName + ' is now known as ' + newName + '.'
                });
            }
        }
        socket.on('init', function (data) {
            $scope.name = data.name;
            $scope.users = data.users;
            $scope.messages = data.messages;
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
            var i;
            if (-1 < (i = $scope.users.indexOf(data.name))) {
                $scope.users.splice(i, 1);
            }
        });
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
    }]);
