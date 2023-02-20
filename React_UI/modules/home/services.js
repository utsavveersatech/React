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

        $rootScope.serverUrl = "http://localhost:3000/api/v1/"; // Another URL "https://my-json-server.typicode.com/artfuldev/json-db-data/"

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

        helper.getComments = function(inv_id,callback){
            $http.get($rootScope.serverUrl+'comments?inventory_id=' + inv_id)
            .success(function (response) {
                callback(response);
            });
        }

        helper.editComments = function(comment_id, comment, callback){
            $http.put($rootScope.serverUrl+'editComments', {
                content: comment,
                comment_id: comment_id
            }).success(function(response){
                callback(response)
            })
        }

        helper.deleteComments = function(comment_id,callback){
            $http.delete($rootScope.serverUrl+'comments?comment_id=' + comment_id)
            .success(function (response) {
                callback(response);
            });
        }
        helper._getContentReactions = function (userContentReactions, callback) {
            let createdReactions = new Object();
            $rootScope.reactionsList.reactions.forEach(function(reaction) {
                createdReactions[reaction.id] = {emoji: reaction.emoji, currUserReacted: 0,
                                                    name: reaction.name, count: 0, reactedUsers: {}
                                                }
            });

            let totalReactedCount = 0;
            userContentReactions.forEach(function(contentReaction) {
                 createdReactions[contentReaction.id].count++;
                 totalReactedCount++;
                 if(contentReaction.user_id == $rootScope.globals.currentUser.userId) {
                    createdReactions[contentReaction.id].currUserReacted = 1;
                    createdReactions[contentReaction.id].contentReactionId = contentReaction.id;
                 }
            });
            callback(createdReactions, totalReactedCount);
        };

        helper._getCommentReactions = function (userCommentReactions, callback) {
            let createdReactions = new Object();
            $rootScope.reactionsList.reactions.forEach(function(reaction) {
                createdReactions[reaction.id] = {emoji: reaction.emoji, currUserReacted: 0,
                                                    name: reaction.name, count: 0, reactedUsers: {}
                                                }
            });

            let totalReactedCount = 0;
            userCommentReactions.forEach(function(commentReaction) {
                 createdReactions[commentReaction.id].count++;
                 totalReactedCount++;
                 if(commentReaction.user_id == $rootScope.globals.currentUser.userId) {
                    createdReactions[commentReaction.id].currUserReacted = 1;
                    createdReactions[commentReaction.id].commentReactionId = commentReaction.id;
                 }
            });
            callback(createdReactions, totalReactedCount);
        };

        helper.getContentReactions = function (contentId, callback) {
            $http.get($rootScope.serverUrl+'user_content_reactions?content_id='+ contentId)
               .success(function (response) {
                    let userContentReactions = response;
                    if($rootScope.reactionsList) {
                        helper._getContentReactions(userContentReactions.reactions, callback);
                    }
                    else {
                        $http.get($rootScope.serverUrl+'reactions')
                           .success(function (response) {
                                $rootScope.reactionsList = response;
                                helper._getContentReactions(userContentReactions.reactions, callback);
                            });
                    }
               });
        };

        helper.getCommentReactions = function (commentId, callback) {
            $http.get($rootScope.serverUrl+'comment_reactions?comment_id='+ commentId)
               .success(function (response) {
                    let userCommentReactions = response;
                    $rootScope.comments = response.reactions
                    if($rootScope.reactionsList) {
                        helper._getCommentReactions(userCommentReactions.reactions, callback);
                    }
                    else {
                        $http.get($rootScope.serverUrl+'reactions')
                           .success(function (response) {
                                $rootScope.reactionsList = response;
                                helper._getCommentReactions(userCommentReactions.reactions, callback);
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
                    let userContentReactions = response.reactions;
                    let reactedUserList = new Object();
                    $rootScope.userList.users.forEach(function(user) {
                        userContentReactions.forEach(function(contentReaction) {
                            if(contentReaction.user_id == user.id) {
                                reactedUserList[user.id] = user;
                            }
                        });
                    });
                    callback(reactedUserList);
                });
        };

        helper.triggerReaction = function (contentId, reactionId, contentReactionId, userId, content_type, callback) {
            if(contentReactionId && $('#content-'+contentId+'-react-'+reactionId).hasClass('selected')) {
                $http.delete($rootScope.serverUrl+`user_content_reactions?content_id=${contentId}&reaction_id=${reactionId}&user_id=${userId}&content_type=${content_type}`)
                   .success(function (response) {
                        callback();
                   });
                }
            else {
                $http.post($rootScope.serverUrl+`user_content_reactions?content_id=${contentId}&reaction_id=${reactionId}&user_id=${userId}&content_type=${content_type}`)
                   .success(function (response) {     
                        callback(response.reaction.id);
                   });
            }
        };
        return helper;
    }]);
