/*jslint node:true */
/*globals angular, io */
'use strict';

angular.module('flatGames.controllers', []).
    controller('HomeCtrl', ['$scope', 'Socket', function ($scope, socket) {
    }]).
    controller('LoginCtrl', ['$scope', 'Socket', function ($scope, socket) {
        $scope.submit = function () {
            socket.emit('user:login', {
                name: $scope.user.name,
                hash: new Date().getTime().toString(16).toString()
            });
        };
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
