'use strict';

angular.module('Home')

.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
})
.controller('DashboardController',
    ['$scope', '$rootScope', '$http', '$location', '$timeout', 'Helpers',
    function ($scope, $rootScope, $http, $location, $timeout, Helpers) {
    	$scope.loading = true;
    	$rootScope.globals.currentUser.userId = 1;
    	$scope.logouttransition = Helpers.logouttransition;

    	Helpers.getAllUsers();
    	Helpers.getCurrentUser();

    	$http.get('http://localhost:3000/api/v1/inventories')
               .success(function (response) {
                   $scope.approvedinv = response.approvedinventories;
                   $scope.loading = false;
               });
        
		$scope.edittransition = function (currentrecord) {
				$rootScope.editrecord = currentrecord;
				$location.path('/edit');
        };

		$scope.addtransition = function () {
				$location.path('/add');
        };

        $scope.dashboardtransition = Helpers.dashboardtransition;

		$scope.delete = function (id) {
			if($rootScope.globals.currentUser.manager == true)	{
				$scope.status = 'Approved';
			}
			else {
				$scope.status = 'Pending';
			}
			$http.delete('http://localhost:3000/api/v1/inventories/' + id
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
.controller('AddInventoryController',
    ['$scope', '$rootScope', '$http', '$location', 'Helpers',
    function ($scope, $rootScope, $http, $location, Helpers) {
        $scope.dashboardtransition = Helpers.dashboardtransition;

        $scope.logouttransition = Helpers.logouttransition;

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
    ['$scope', '$rootScope', '$http', '$location', '$timeout', 'Helpers',
    function ($scope, $rootScope, $http, $location, $timeout, Helpers) {
    	if ( $rootScope.editrecord == null ) {
	          $location.path( "/" );
      	}
      	else {
      		$scope.reactedUsers = {};
      		$rootScope.globals.currentUser.userId = 1;
	      	$scope.contentId = $rootScope.editrecord.productname; // $scope.contentId = 1;
	      	$scope.contents = {
	      						'2': {content: 'static comment 1', author_id: 2, author: 'User 2', contentId : '2'},
	      					    '3': {content: 'static comment 2', author_id: 1, author: 'User 1 again', contentId : '3'}
	      					};

	      	// post reactions
	        Helpers.getContentReactions($scope.contentId, function(contentReactions, totalReactedCount) {
	        	$scope.contentReactions = contentReactions;
	        	$scope.totalReactedCount = totalReactedCount;

	        	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
			    	Object.keys($scope.contentReactions).forEach(function(reactionKey) {
		        		if($scope.contentReactions[reactionKey].currUserReacted > 0){
		        			$('#content-'+$scope.contentId+'-react-'+reactionKey).addClass('selected');
		        		}
		        	});
				});
	        });

	        // comment reactions
			Object.keys($scope.contents).forEach(function(key) {
		        Helpers.getContentReactions(key, function(contentReactions, totalReactedCount) {
		        	$scope.contents[key].contentReactions = contentReactions;
		        	$scope.contents[key].totalReactedCount = totalReactedCount;

		        	$scope.$on('ngRepeatCommentFinished', function(ngRepeatFinishedEvent) {
			        	Object.keys(contentReactions).forEach(function(reactionKey) {
			        		if(contentReactions[reactionKey].currUserReacted > 0){
			        			$('#content-'+key+'-react-'+reactionKey).addClass('selected');
			        		}
			        	});
		        	});
		        });
            });

	        $("#dimmer").click(function(){
				$('.reactionsContainer').removeClass('display');
				$('body').removeClass('fixed');
				$('#contentReactionsPopup').removeClass('display');
				delete $scope.currentContentAllReactors;
				$('#dimmer').css('display', 'none');
			});
	    }

        $scope.getReactedUsers = function(contentId, reactionId, isPost=false) {
        	if (( $scope.contents[contentId]?.contentReactions[reactionId]?.reactedUsers) != {} && $scope.contentReactions[reactionId]?.reactedUsers != {}) {
        		Helpers.getReactedUsers(contentId, reactionId, function(response) {
	        		if(isPost) {
	        			$scope.contentReactions[reactionId].reactedUsers = response;
	        		}
	        		else {
	        			$scope.contents[contentId].contentReactions[reactionId].reactedUsers = response;
	        		}
	       			$(".contentReaction .tooltiptext").show();
        		});
        	}
        	else {
        		$(".contentReaction .tooltiptext").show();
        	}
        };

        $scope.hideToolTip = function() {
        	$(".contentReaction .tooltiptext").hide();	
        }

        $scope.openReactionsContainer = function(contentId) {
        	$('#dimmer').css('display', 'block');
        	$('#reactionsContainer-'+ contentId).addClass('display');
        };

        $scope.getReactedUsersPopup = function(key) {
        	$(".reactorsSection").hide();
        	$('.reactorsControl').removeClass('selected');
        	$('#reactors-control-'+key).addClass('selected');
        	if(key == 'All') {
        		if(!$scope.currentContentAllReactors) {
	        		$scope.currentContentAllReactors = {};
					Helpers.getReactedUsers($scope.popupcontentId, null, function(response) {
						$scope.currentContentAllReactors = response;
		       			$(".popupAllReactors").show();
	        		});   			
        		}
        		else {
        			$(".popupAllReactors").show();
        		}
        	}
        	else {
        		if(Object.keys($scope.popupContentReactions[key].reactedUsers).length === 0) {
        			Helpers.getReactedUsers($scope.popupcontentId, key, function(response) {
						$scope.popupContentReactions[key].reactedUsers = response;
		       			$(".popupReactor-"+key).show();
	        		});
        		}
        		else {
       				$(".popupReactor-"+key).show();
        		}
        	}
        };

        $scope.openContentReactionsPopup = function(contentId, isPost=false) {
        	$('body').addClass('fixed');
        	$('#dimmer').css('display', 'block');
        	$('#contentReactionsPopup').addClass('display');
        	$scope.popupcontentId = contentId;
        	if(isPost) {
	        	$scope.popupContentReactions = $scope.contentReactions; // $scope.popupContentReactions = Object.assign({}, $scope.contentReactions);
        	}
        	else {
        		$scope.popupContentReactions = $scope.contents[contentId].contentReactions; // $scope.popupContentReactions = Object.assign({}, $scope.contents[contentId].contentReactions);
        		
        	}

        	$scope.getReactedUsersPopup('All', $scope.popupContentReactions);
        };

        $scope.toggleTriggerReaction = function (contentId, reactionId, contentReactionId, isPost=false) {
	        Helpers.triggerReaction(contentId, reactionId, contentReactionId, $rootScope.globals.currentUser.userId, function(id) {
	        	let contentReactions;
	        	if(isPost) {
	        		contentReactions = $scope.contentReactions;
	        	}
	        	else {
	        		contentReactions = $scope.contents[contentId].contentReactions;
	        	}
	        	if(id) {
	        		contentReactions[reactionId].contentReactionId = id;
	        		contentReactions[reactionId].reactedUsers[$rootScope.globals.currentUser.userId] =  $rootScope.globals.currentUser.userList[0];
	        		contentReactions[reactionId].currUserReacted = 1;
	        		contentReactions[reactionId].count++;
	        		
	        		if(isPost){
	        			$scope.totalReactedCount++;
	        		}
	        		else{
	        			$scope.contents[contentId].totalReactedCount++;
	        		}
	        		
	        		$('#content-'+contentId+'-react-'+reactionId).addClass('selected');
	        	}
	        	else {
	        		delete contentReactions[reactionId].contentReactionId;
	        		delete contentReactions[reactionId].reactedUsers[$rootScope.globals.currentUser.userId];
	        		contentReactions[reactionId].currUserReacted = 0;
	        		contentReactions[reactionId].count--;
	        		if(isPost){
	        			$scope.totalReactedCount--;
	        		}
	        		else{
	        			$scope.contents[contentId].totalReactedCount--;
	        		}
	        		$('#content-'+contentId+'-react-'+reactionId).removeClass('selected');
	        	}
	        });
        };

    	$scope.logouttransition = Helpers.logouttransition;

        $scope.dashboardtransition = Helpers.dashboardtransition;

		$scope.saveEdit = function (id) {
			$scope.dataLoading = true;
			$http.put('http://localhost:3000/api/v1/inventories/' + id,
			{
				productname: $rootScope.editrecord.productname,
				vendor: $rootScope.editrecord.vendor,
			}).success(function (response) {
                   if(response.success) {

	                    $location.path('/');
	                } else {
	                    $scope.error = response.message;
	                    $scope.dataLoading = false;
	                }
               });
        };

        $scope.cancel = Helpers.dashboardtransition;
    }]);
