/*jslint node:true */
/*globals angular, io */
'use strict';

angular.module('flatGames.services', []).
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