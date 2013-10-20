/*jslint node:true */
/*global angular */
'use strict';

angular.module('FlatTest', ['flatGames', 'ngMockE2E']).
    run(['$httpBackend', 'LocalStorage', function ($httpBackend, LocalStorage) {
        $httpBackend.whenGET(/public\/.*/).passThrough(); // make sure static files are served

        /*function logoutResponse(method, url, data, headers) {
            //_setRegistrationState("Initial");
            LocalStorage.set('LoginState', false);
            return [200, {Code: 0 } ];
        }
        $httpBackend.whenPOST('/api/logout').respond(logoutResponse);*/

    }]);