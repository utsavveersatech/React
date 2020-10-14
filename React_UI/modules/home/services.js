'use strict';
 
angular.module('Helpers')

.factory('Helpers', ['$http', '$location', '$cookieStore', '$rootScope', '$timeout',
     function($http, $location, $cookieStore, $rootScope, $timeout) {
        var helper = {
        Helpers: []

        };

        helper.logouttransition = function () {
            $location.path('/login');
        };

        helper.dashboardtransition = function() {
            $location.path('/');
        };

        $rootScope.serverUrl = "https://artful-iudex.herokuapp.com/"; // Another URL "https://my-json-server.typicode.com/artfuldev/json-db-data/"

        helper.getAllUsers = function () { // expecting a different API to fetch users based on content or reaction alone
            if (!$rootScope.userList) {
                $http.get($rootScope.serverUrl+'users')
                   .success(function (response) {
                       $rootScope.userList = response;
                   });
            }
        };

        helper.getCurrentUser = function () {
            if (!$rootScope.currentUser) {
                $http.get($rootScope.serverUrl+'users?id=' + $rootScope.globals.currentUser.userId)
                   .success(function (response) {
                       $rootScope.globals.currentUser.userList = response;
                   });
            }
        };

        helper._getContentReactions = function (userContentReactions, callback) {
            let createdReactions = new Object();

            $rootScope.reactionsList.forEach(function(reaction) {
                createdReactions[reaction.id] = {emoji: reaction.emoji, currUserReacted: 0,
                                                    name: reaction.name, count: 0, reactedUsers: {}
                                                }
            });

            let totalReactedCount = 0;
            userContentReactions.forEach(function(contentReaction) {
                totalReactedCount++;
                 createdReactions[contentReaction.reaction_id].count++;
                 if(contentReaction.user_id == $rootScope.globals.currentUser.userId) {
                    createdReactions[contentReaction.reaction_id].currUserReacted = 1;
                    createdReactions[contentReaction.reaction_id].contentReactionId = contentReaction.id;
                 }
            });
            callback(createdReactions, totalReactedCount);
        };

        helper.getContentReactions = function (contentId, callback) {
            $http.get($rootScope.serverUrl+'user_content_reactions?content_id='+ contentId)
               .success(function (response) {
                    let userContentReactions = response;
                    if($rootScope.reactionsList) {
                        helper._getContentReactions(userContentReactions, callback);
                    }
                    else {
                        $http.get($rootScope.serverUrl+'reactions')
                           .success(function (response) {
                                $rootScope.reactionsList = response;
                                helper._getContentReactions(userContentReactions, callback);
                            });
                    }
               });
        };

        helper.getReactedUsers = function (contentId, reactionId, callback) {
            let requestUrl = $rootScope.serverUrl+'user_content_reactions?content_id='+ contentId;
            if(reactionId != null) {
                requestUrl = requestUrl + '&reaction_id=' + reactionId;
            }
            $http.get(requestUrl)
               .success(function (response) {
                    let userContentReactions = response;
                    let reactedUserList = new Object();
                    $rootScope.userList.forEach(function(user) {
                        userContentReactions.forEach(function(contentReaction) {
                            if(contentReaction.user_id == user.id) {
                                reactedUserList[user.id] = user;
                            }
                        });
                    });
                    callback(reactedUserList);
                });
        };

        helper.triggerReaction = function (contentId, reactionId, contentReactionId, userId, callback) {
            if(contentReactionId && $('#content-'+contentId+'-react-'+reactionId).hasClass('selected')) {
                $http.delete($rootScope.serverUrl+'user_content_reactions/'+ contentReactionId)
                   .success(function (response) {
                        callback();
                   });
            }
            else {
                $http.post($rootScope.serverUrl+'user_content_reactions?id=', {content_id: contentId, reaction_id: reactionId, user_id: userId})
                   .success(function (response) {                        
                        callback(response.id);
                   });
            }
        };
        return helper;
    }]);
