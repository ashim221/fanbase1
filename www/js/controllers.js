angular.module('starter.controllers', [])

// Authentication controller
// Put your login, register functions here
.controller('AuthCtrl', function($scope, $ionicHistory, $ionicSideMenuDelegate, $q, UserService, $ionicLoading, AuthService, $state, $cookies) {
	
  $scope.login = function(user){
    $ionicLoading.show({
      template: 'Logging in ...'
    }),

    AuthService.doLogin(user)
    .then(function(user){
      // success
	 
      $state.go('home');
      $ionicLoading.hide();
    },function(err){
      // error
	  console.log(err);
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
  $scope.signup = function(user){
    $ionicLoading.show({
      template: 'Signing up ...'
    });

    AuthService.doSignup(user)
    .then(function(user){
      // success
	
      $state.go('home');
      $ionicLoading.hide();
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }
	
    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide();
      $state.go('home');
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
	
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);

    		// Check if we have our user saved
    		var user = UserService.getUser('facebook');

    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});

						$state.go('home');
					}, function(fail){
						// Fail get profile info
						console.log('profile info fail', fail);
					});
				}else{
					$state.go('home');
				}
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
 facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  // disabled swipe menu
  $ionicSideMenuDelegate.canDragContent(false);
})
// Home controller
.controller('HomeCtrl', function($scope, Posts, $state, UserService, AuthService, $ionicActionSheet, $ionicLoading, $http, $ionicScrollDelegate, $timeout, $cookies, sessionService) {
	$state.reload();
  // view user
  $scope.viewUser = function(userId) {
    $state.go('user', {userId: userId});
  }
	
	$http.get("https://fanbaseapp.com/featured_category_with_users.php")
    .then(function (response) {$scope.names = response.data.records;});
		console.log($scope.names);
	
  // get list posts froms service
  $scope.posts = Posts.all();

  // toggle like button
  $scope.toggleLike = function (post) {
    // if user liked
    if(post.liked) {
      post.likeCount--;
    } else {
      post.likeCount++;
    }
    post.liked = !post.liked;
  };

  // view post
  $scope.viewPost = function(postId) {
    $state.go('post', {postId: postId});
  }

  $scope.token = $cookies.get("token");
  $scope.token = sessionService.get("token");
  console.log($scope.token);
  $scope.user1 = AuthService.getUser($scope.token);

	 $scope.showLogOutMenu = function() {
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
				  template: 'Logging out...'
				});

        // Facebook logout
       facebookConnectPlugin.logout(function(){
          $ionicLoading.hide();
          $state.go('welcome');
        },
        function(fail){
          $ionicLoading.hide();
        });
			}
		}); 
}
 setTimeout(function(){
       $ionicLoading.show({
      template: 'Loading...'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
  },2500);
})

// Chat controller, view list chats and chat detail
.controller('ChatCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();

  // remove a conversation
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

  // mute a conversation
  $scope.mute = function(chat) {
    // write your code here
  }
})

.controller('CategoriesCtrl', function($scope, Posts, $state, UserService, $ionicLoading, $http, $ionicSlideBoxDelegate) {
	$state.reload();
	
  // view user
  $scope.viewUser = function(userId) {
    $state.go('user', {userId: userId});
  }
	
	$http.get("https://fanbaseapp.com/all_category_with_users.php")
    .then(function (response) {$scope.names = response.data.records;});
		console.log($scope.names);
	
  // get list posts froms service
  $scope.posts = Posts.all();
$scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  // toggle like button
  $scope.toggleLike = function (post) {
    // if user liked
    if(post.liked) {
      post.likeCount--;
    } else {
      post.likeCount++;
    }
    post.liked = !post.liked;
  };

  // view post
  $scope.viewPost = function(postId) {
    $state.go('post', {postId: postId});
  }
  setTimeout(function(){
       $ionicLoading.show({
      template: 'Loading...'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
      $ionicSlideBoxDelegate.update();
  },2500);

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $ionicScrollDelegate, $ionicActionSheet, $timeout) {
  //$scope.chat = Chats.get($stateParams.chatId);
  $scope.chat = Chats.get(0);

  $scope.sendMessage = function() {
    var message = {
      type: 'sent',
      time: 'Just now',
      text: $scope.input.message
    };

    $scope.input.message = '';

    // push to massages list
    $scope.chat.messages.push(message);

    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
  };

  // hover menu
  $scope.onMessageHold = function(e, itemIndex, message) {
    // show hover menu
    $ionicActionSheet.show({
      buttons: [
        {
          text: 'Copy Text'
        }, {
          text: 'Delete Message'
        }
      ],
      buttonClicked: function(index) {
        switch (index) {
          case 0: // Copy Text
            //cordova.plugins.clipboard.copy(message.text);

            break;
          case 1: // Delete
            // no server side secrets here :~)
            $scope.chat.messages.splice(itemIndex, 1);
            break;
        }

        return true;
      }
    });
  };
})

.controller('PostCtrl', function($scope, Posts, $state) {
  // get list posts froms service
  $scope.post = Posts.get(0);

  // toggle like button
  $scope.toggleLike = function (post) {
    // if user liked
    if(post.liked) {
      post.likeCount--;
    } else {
      post.likeCount++;
    }
    post.liked = !post.liked;
  };

  // view user function
  $scope.viewUser = function(userId) {
    $state.go('user', {userId: userId});
  }
})

// Notifications controller
.controller('NotificationsCtrl', function($scope, Notifications) {
  // get list posts from service
  $scope.notifications = Notifications.all();
})

// ContactsCtrl controller
.controller('ContactsCtrl', function($scope, Contacts, $state) {
  // get list posts froms service
  $scope.contacts = Contacts.all();

  // view contact function
  $scope.viewContact = function(contactId) {
    $state.go('user', {userId: contactId});
  }
})

// UserCtrl controller
.controller('UserCtrl', function($scope, Contacts, Posts, $stateParams, $http, $stateParams) {
  // get contact from Contacts service
  // set the userId here
  $scope.userId = $stateParams.userId;
 $scope.linkw = "https://fanbaseapp.com/user_profile.php?userId="+$scope.userId;
  console.log($scope.linkw);
 
$http.get($scope.linkw).then(function (response) {
	  $scope.userCeleb = response.data.record;});
		console.log($scope.userCeleb);
  $scope.user = Contacts.get(0);
  // attach post to this contact
  angular.extend($scope.user, {
    'followers': 199,
    'following': 48,
    'favorites': 14,
    'posts': Posts.all()
  });
  console.log($scope.userCeleb);
})

// SettingCtrl controller
.controller('SettingCtrl', function($scope){

});


