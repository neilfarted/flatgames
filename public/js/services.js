/*jslint node:true */
/*globals angular, io */
'use strict';

angular.module('flatGames.services', []).
    factory('LocalStorage', ['$window', function ($window) {
        var store = $window.localStorage,
            checkLocalStorage = function () {
                try {
                    store.setItem('test', 'test');
                    store.removeItem('test');
                } catch (e) {
                    return false;
                }
            };

        return {
            hasLocalStorage: checkLocalStorage,
            get: function (key) {
                if (checkLocalStorage() && store.hasOwnProperty(key)) {
                    return JSON.parse(store[key]);
                }
                return null;
            },
            set: function (key, value) {
                if (checkLocalStorage()) {
                    store[key] = JSON.stringify(value);
                    return true;
                }
                return null;
            },
            remove: function (key) {
                if (checkLocalStorage()) {
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