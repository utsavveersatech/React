'use strict';

// declare modules
angular.module('Authentication', []);

angular.module('onFinishRender', []);
angular.module('Helpers', []);

angular.module('Home', ['Helpers']);
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
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);