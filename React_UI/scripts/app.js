'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);

angular.module('SIMApp', [
    'Authentication',
    'Home',
    'ngRoute',
    'ngCookies'
])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
        .when('/', {
            controller: 'DashboardController',
            templateUrl: 'modules/home/views/dashboard.html'
        })
        .when('/approve', {
            resolve : {
                "check": function($location, $rootScope) {
                    if(!$rootScope.globals.currentUser.manager) {
                        $location.path('/login');
                    }
                }
            },
            controller: 'ApproveController',
            templateUrl: 'modules/home/views/approvalboard.html'
        })
        .when('/add', {
            controller: 'AddInventoryController',
            templateUrl: 'modules/home/views/addinventory.html'
        })
        .when('/edit', {
            controller: 'EditInventoryController',
            templateUrl: 'modules/home/views/editinventory.html'
        })
        .otherwise({ redirectTo: '/login' });
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);