'use strict';

angular.module('Home')

.controller('DashboardController',
    ['$scope', '$rootScope', '$http', '$location', '$timeout',
    function ($scope, $rootScope, $http, $location, $timeout) {
    	$scope.loading = true;
    	$http.get('http://localhost:3000/api/v1/inventories')
               .success(function (response) {
                   $scope.approvedinv = response.approvedinventories;
                   $scope.pendinginv = response.pendinginventories;
                   $scope.loading = false;
               });
        
		$scope.edittransition = function (currentrecord) {
				$rootScope.editrecord = currentrecord;
				$location.path('/edit');
        };

		$scope.addtransition = function () {
				$location.path('/add');
        };

        $scope.approvetransition = function () {
				$location.path('/approve');
        };

        $scope.dashboardtransition = function () {
				$location.path('/');
        };

        $scope.logouttransition = function () {
				$location.path('/login');
        };

		$scope.delete = function (id) {
			if($rootScope.globals.currentUser.manager == true)	{
				$scope.status = 'Approved';
			}
			else {
				$scope.status = 'Pending';
			}
			$http.put('http://localhost:3000/api/v1/inventories/' + id,
				{
				status: $scope.status,
				modifiedby: $rootScope.globals.currentUser.username,
				lastoperation: 'Delete'
				}
			).success(function (response) {
                   if(response.success) {
	                    $scope.error = response.message;
	                    $scope.dataLoading = true;
	                    $http.get('http://localhost:3000/api/v1/inventories')
		               .success(function (response) {
		                   $scope.approvedinv = response.approvedinventories;
		                   $scope.pendinginv = response.pendinginventories;
		               });
	                } else {
	                    $scope.error = response.message;
						$scope.dataLoading = true;

	                }
	                $timeout(function(){
	                	$scope.dataLoading = false;
		            }, 1000);
	                
               });
        };

    }])

.controller('ApproveController',
    ['$scope', '$rootScope', '$http', '$location', '$timeout',
    function ($scope, $rootScope, $http, $location, $timeout) {
    	$scope.loading = true;
    	$http.get('http://localhost:3000/api/v1/inventories')
               .success(function (response) {
                   $scope.pendinginv = response.pendinginventories;
                   $scope.loading = false;
               });

        $scope.dashboardtransition = function () {
				$location.path('/');
        };

        $scope.logouttransition = function () {
				$location.path('/login');
        };

		$scope.approve = function (id) {
			$http.put('http://localhost:3000/api/v1/inventories/' + id,
				{
				status: 'Approved',
				modifiedby: $rootScope.globals.currentUser.username,
				}
			).success(function (response) {
                   if(response.success) {
	                    $scope.error = response.message;
	                    $scope.dataLoading = true;
	                    $http.get('http://localhost:3000/api/v1/inventories')
		               .success(function (response) {
		                   $scope.pendinginv = response.pendinginventories;
		               });
	                } else {
	                    $scope.error = response.message;
						$scope.dataLoading = true;
	                }
	                $timeout(function(){
	                	$scope.dataLoading = false;
		            }, 1000);
               });
        };
    }])
.controller('AddInventoryController',
    ['$scope', '$rootScope', '$http', '$location',
    function ($scope, $rootScope, $http, $location) {
        $scope.dashboardtransition = function () {
				$location.path('/');
        };

        $scope.logouttransition = function () {
				$location.path('/login');
        };

		$scope.add = function () {
			$scope.dataLoading = true;
			if($rootScope.globals.currentUser.manager == true)	{
				$scope.status = 'Approved';
			}
			else {
				$scope.status = 'Pending';
			}
			$http.post('http://localhost:3000/api/v1/inventories',
			{
				productid: $scope.productid,
				productname: $scope.productname,
				vendor: $scope.Vendor,
				mrp: $scope.MRP,
				batchnum: $scope.BatchNum,
				batchdate: $scope.BatchDate,
				quantity: $scope.Quantity,
				status: $scope.status,
				modifiedby: $rootScope.globals.currentUser.username,
				lastoperation: 'Add',
			}).success(function (response) {
                   if(response.success) {
	                    
	                    $location.path('/');
	                } else {
	                    $scope.error = response.message;
	                    $scope.dataLoading = false;
	                }
               });
        };

        $scope.cancel = function () {
			$location.path('/');
        };
    }])
.controller('EditInventoryController',
    ['$scope', '$rootScope', '$http', '$location',
    function ($scope, $rootScope, $http, $location) {
        $scope.dashboardtransition = function () {
				$location.path('/');
        };

        $scope.logouttransition = function () {
				$location.path('/login');
        };

		$scope.edit = function (id) {
			$scope.dataLoading = true;
			if($rootScope.globals.currentUser.manager == true)	{
				$scope.status = 'Approved';
			}
			else {
				$scope.status = 'Pending';
			}
			$http.put('http://localhost:3000/api/v1/inventories/' + id,
			{
				productid: $rootScope.editrecord.productid,
				productname: $rootScope.editrecord.productname,
				vendor: $rootScope.editrecord.vendor,
				mrp: $rootScope.editrecord.mrp,
				batchnum: $rootScope.editrecord.batchnum,
				batchdate: $rootScope.editrecord.batchdate,
				quantity: $rootScope.editrecord.quantity,
				status: $scope.status,
				modifiedby: $rootScope.globals.currentUser.username,
				lastoperation: 'Edit',
			}).success(function (response) {
                   if(response.success) {

	                    $location.path('/');
	                } else {
	                    $scope.error = response.message;
	                    $scope.dataLoading = false;
	                }
               });
        };

        $scope.cancel = function () {
			$location.path('/');
        };
    }]);