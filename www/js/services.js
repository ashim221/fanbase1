angular.module('starter.services', ["ngStorage"])


.service('UserService', function($http, $httpParamSerializerJQLike) {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
	$http({
  method: 'POST',
  url: 'https://fanbaseapp.com/fbuser.php',
  data: $httpParamSerializerJQLike({
      "authResponse":user_data.authResponse,
      "userId":user_data.userID, 
	  "userName":user_data.name,
	  "userEmail":user_data.email,
	  "userPicture":user_data.picture
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
}
})
  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [
      {
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/thumb/ben.png',
        messages: [
          {
            type: 'received',
            text: 'Hey, How are you? wanna hang out this friday?',
            image: '',
            time: 'Thursday 05:55 PM'
          },
          {
            type: 'sent',
            text: 'Good, Yes sure why not :D',
            image: '',
            time: 'Thursday 05:56 PM'
          },
          {
            type: 'received',
            text: 'Check out this view from my last trip',
            image: '/img/thumb/canada.jpg',
            time: 'Thursday 05:57 PM'
          },
          {
            type: 'sent',
            text: 'Looks Great is that view in Canada?',
            image: '',
            time: 'Thursday 05:58 PM'
          },
          {
            type: 'received',
            text: 'Yes, it\'s in Canada',
            image: '',
            time: 'Thursday 05:57 PM'
          }
        ]
      },
      {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/thumb/max.png'
      },
      {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/thumb/adam.jpg'
      },
      {

        d: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/thumb/perry.png'
      },
      {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/thumb/mike.png'
      },
      {
        id: 5,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/thumb/ben.png'
      },
      {
        id: 6,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/thumb/max.png'
      }
    ];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })
.service('AuthService', function($q, $http, $httpParamSerializerJQLike, $cookies, $rootScope, $cookieStore){
	
	var auth={
		data:{
			username:null,
			password:null,
			token:null,
			header:{},
			accessObj:{},
			user:{}
		}
	}
  /*this.userIsLoggedIn = function(){
	  
    var deferred = $q.defer(),
        authService = this,
        isLoggedIn = (authService.getUser() !== null);

    deferred.resolve(isLoggedIn);

    return deferred.promise;
  };

  /*this.getUser = function(){
    var deferred = $q.defer();
	$http({
  method: 'GET',
  url: 'https://fanbaseapp.com/auth.php',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}),(function (response) {
        // The then function here is an opportunity to modify the response
        console.log(response);
        // The return value gets picked up by the then in the controller.
        return response.data;
})
      };*/
	  
  this.getUser1=function(){
    return JSON.parse(window.localStorage.user1 || '{}');
  };
  
  this.fbLogin=function(user){
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'https://fanbaseapp.com/fbuser.php',
  data: $httpParamSerializerJQLike({
      "authResponse":user.authResponse,
      "userId":user.userID, 
	  "userName":user.name,
	  "userEmail":user.email,
	  "userPicture":user.picture
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		auth.data.header = {headers: {'token': response.data.token}};
		$cookies.put("token", response.data.token, 365);
		window.localStorage.setItem('token', response.data.token);
		window.localStorage.user = JSON.stringify(auth.data.user);
		auth.data.user = response.data;
		console.log (auth.data.user);
		deferred.resolve(response.data);
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };
/*,function(errors, data) {
      if (errors) {
		   console.log("failed");
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
      } else {
		  console.log("success");
        deferred.resolve(data);
      }
    };*/

  
  this.doSignup = function(user){
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'https://fanbaseapp.com/register_users.php',
  data: $httpParamSerializerJQLike({
	  "name":user.name,
      "email":user.email,
      "password":user.password
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		auth.data.header = {headers: {'token': response.data.token}};
		$cookies.put("token", response.data.token, 365);
		auth.data.user = response.data;
		window.localStorage.setItem('token', response.data.token);
		window.localStorage.user = JSON.stringify(auth.data.user);
		console.log (auth.data.user);
		deferred.resolve(response.data);
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };
  this.userIsLoggedIn = function(){
    var deferred = $q.defer(),
        authService = this,
		tok = window.localStorage.getItem('token');
        isLoggedIn = (authService.getUser(tok) !== null);

    deferred.resolve(isLoggedIn);

    return deferred.promise;
  };
this.getUser = function(token){
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'https://fanbaseapp.com/auth.php',
  data: $httpParamSerializerJQLike({
	  "token":token
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		auth.data.header = {headers: {'token': response.data.token}};
		$cookies.put("token", response.data.token, 365);
		auth.data.user = response.data;
		console.log (auth.data.user);
		deferred.resolve(response.data);
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };
    
this.doLogin = function(user){
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'https://fanbaseapp.com/authorise_users.php',
  data: $httpParamSerializerJQLike({
      "email":user.email,
      "password":user.password
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		auth.data.header = {headers: {'token': response.data.token}};
		$cookies.put("token", response.data.token, 365);
		auth.data.user = response.data;
		window.localStorage.setItem('token', response.data.token);
		window.localStorage.user = JSON.stringify(auth.data.user);
		console.log (auth.data.user);
		deferred.resolve(response.data);
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };
    tok = window.localStorage.getItem('token');
	this.doLogout = function(tok){
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'https://fanbaseapp.com/logout.php',
  data: $httpParamSerializerJQLike({
      "token":token
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		window.localStorage.removeItem('token');
		window.localStorage.removeItem('user');
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };
})

  .factory('Posts', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var posts = [
      {
        id: 0,
        user_id: 2,
        name: 'Ben Sparrow',
        content: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so...',
        image: 'img/pizza.jpg',
        face: 'img/thumb/ben.png',
        time: 'Thursday 05:57 PM',
        liked: false,
        likeCount: 2,
        commentCount: 5,
        comments: [
          {
            id: 0,
            user_id: 2,
            name: 'Max Lynx',
            face: 'img/thumb/max.png',
            liked: false,
            likeCount: 2,
            time: 'Thursday 05:57 PM',
            content: 'A wonderful serenity has taken possession'
          },
          {
            id: 1,
            user_id: 2,
            name: 'Adam Bradleyson',
            face: 'img/thumb/adam.jpg',
            liked: true,
            likeCount: 1,
            time: 'Thursday 05:57 PM',
            content: 'I should buy a boat'
          },
          {
            id: 2,
            user_id: 2,
            name: 'Perry Governor',
            face: 'img/thumb/perry.png',
            liked: true,
            likeCount: 3,
            time: 'Thursday 05:57 PM',
            content: 'Look at my mukluks!'
          },
          {
            id: 3,
            user_id: 2,
            name: 'Ben Sparrow',
            face: 'img/thumb/ben.png',
            liked: true,
            likeCount: 1,
            time: 'Thursday 05:57 PM',
            content: 'You on your way?'
          }
        ]
      },
      {
        id: 1,
        user_id: 2,
        name: 'Max Lynx',
        content: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',
        image: '',
        face: 'img/thumb/max.png',
        time: 'Thursday 05:59 PM',
        liked: true,
        likeCount: 2,
        commentCount: 7,
        comments: []
      },
      {
        id: 2,
        user_id: 2,
        name: 'Adam Bradleyson',
        content: 'Far far away, behind the word mountains.',
        image: 'img/burger.jpg',
        face: 'img/thumb/adam.jpg',
        time: 'Thursday 06:06 PM',
        liked: false,
        likeCount: 2,
        commentCount: 2,
        comments: []
      },
      {
        id: 3,
        user_id: 2,
        name: 'Perry Governor',
        content: 'There live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.',
        image: '',
        face: 'img/thumb/perry.png',
        time: 'Thursday 06:50 PM',
        liked: false,
        likeCount: 2,
        commentCount: 7,
        comments: []
      }
    ];

    return {
      all: function () {
        return posts;
      },
      remove: function (post) {
        posts.splice(posts.indexOf(post), 1);
      },
      get: function (postId) {
        for (var i = 0; i < posts.length; i++) {
          if (posts[i].id === parseInt(postId)) {
            return posts[i];
          }
        }
        return null;
      }
    };
  })

  .factory('Notifications', function() {
    // fake data
    var notifications = [
      {
        id: 1,
        type: 'liked',
        user_id: 2,
        name: 'Max Lynx',
        face: 'img/thumb/max.png',
        read: false,
        time: 'Just now'
      },
      {
        id: 2,
        type: 'commented',
        user_id: 2,
        name: 'Adam Bradleyson',
        face: 'img/thumb/adam.jpg',
        read: true,
        time: '3 minutes ago'
      },
      {
        id: 3,
        type: 'friend_request',
        user_id: 2,
        name: 'Perry Governor',
        face: 'img/thumb/perry.png',
        read: true,
        time: '5 minutes ago'
      },
      {
        id: 4,
        type: 'liked',
        user_id: 2,
        name: 'Ben Sparrow',
        face: 'img/thumb/ben.png',
        read: false,
        time: '6 minutes ago'
      },
      {
        id: 5,
        type: 'friend_request',
        user_id: 2,
        name: 'Perry Governor',
        face: 'img/thumb/perry.png',
        read: true,
        time: '5 minutes ago'
      },
      {
        id: 6,
        type: 'liked',
        user_id: 2,
        name: 'Ben Sparrow',
        face: 'img/thumb/ben.png',
        read: false,
        time: '6 minutes ago'
      }
    ];

    return {
      all: function() {
        return notifications
      }
    };

  })
  
  .factory('Contacts', function() {
    // Some fake testing data
    var contacts = [
      {
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/thumb/ben.png',
        group: 'Friend'
      },
      {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/thumb/max.png',
        group: 'Family'
      },
      {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/thumb/adam.jpg',
        group: 'Friend'
      },
      {

        d: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/thumb/perry.png',
        group: 'Friend'
      },
      {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/thumb/mike.png',
        group: 'Family'
      },
      {
        id: 5,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/thumb/ben.png',
        group: 'Friend'
      },
      {
        id: 6,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/thumb/max.png',
        group: 'Family'
      }
    ];

    return {
      all: function() {
        return contacts
      },
      get: function(contactId) {
        for (var i = 0; i < contacts.length; i++) {
          if (contacts[i].id === parseInt(contactId)) {
            return contacts[i];
          }
        }
        return null;
      }
    }
  });
