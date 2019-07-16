var app = angular.module('main', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: './views/home.html',
		controller: 'homeController'
	}).when('/logout', {
		resolve: {
			deadResolve: function($location, user) {
				user.clearData();
				$location.path('/');
			}
		}
	})
	.when('/register',{
		templateUrl:'./views/register.html',
		controller: 'registerController'
	})
	.when('/login', {
		templateUrl: './views/login.html',
		controller: 'loginController'
	}).when('/dashboard', {
		resolve: {
			check: function($location, user) {
				if(!user.isUserLoggedIn()) {
					$location.path('/login');
				}
			},
		},
		templateUrl: './views/dashboard.html',
		controller: 'dashboardController'
	})
	.otherwise({
		template: '404'
	});

	$locationProvider.html5Mode({
			enable :true,
			requireBase : false}); // to get rid of the # in the url each time we change location 
});

app.service('user', function() {
	var username;
	var loggedin = false;
	var id;
	var sessionid;

	this.getSessionid = function(){
		return sessionid;
	}

	this.getName = function() {
		return username;
	};

	this.setID = function(userID) {
		id = userID;
	};
	this.getID = function() {
		return id;
	};

	this.isUserLoggedIn = function() {
		if(!!localStorage.getItem('login')) {
			loggedin = true;
			var data = JSON.parse(localStorage.getItem('login'));
			username = data.username;
			id = data.id;
		}
		return loggedin;
	};

	this.saveData = function(data) {
		username = data.user;
		id = data.id;
		loggedin = true;
		sessionid = data.SID;
		localStorage.setItem('login', JSON.stringify({
			username: username,
			id: id
		}));
	};

	this.clearData = function() {
		localStorage.removeItem('login');
		username = "";
		id = "";
		loggedin = false;
	}
})

app.controller('homeController', function($scope, $location) {
	$scope.logIn = function() {
		$location.path('/login');
	};
	$scope.register = function() {
		$location.path('/register');
	}
});
app.controller('registerController', function($scope, $http, $location, user){
	$scope.login = function() {
		var username = $scope.username;
		var password = $scope.password;
		var confirmPass = $scope.confirmedPassword;

		$http({
			url: 'http://localhost/angularjsMysql/register.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username='+username+'&password='+password+'&confirmPass='+confirmPass
		}).then(function(response) {
			if(response.data.status == 'done') {
				alert('register done');
				$location.path('/login');
			} else if(response.data.status == 'User already exist!') {
				alert('username already exist!');
			}
			else{
				alert('passwords dont match!!');
			}
		})
	}

});
app.controller('loginController', function($scope, $http, $location, user) {
	$scope.login = function() {
		var username = $scope.username;
		var password = $scope.password;
		$http({
			url: 'http://localhost/angularjsMysql/server.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username='+username+'&password='+password
		}).then(function(response) {
			if(response.data.status == 'loggedin') {
				user.saveData(response.data);
				$location.path('/dashboard');
			} else {
				alert('invalid login');
			}
		})
	}
});

app.controller('dashboardController', function($scope, user, $http) {
	$scope.user = user.getName();
	
	$scope.newPass = function() {
		var password = $scope.newpassword;
		$http({
			url: 'http://localhost/angularjsMysql/update.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'newPass='+password+'&id='+user.getID()+'&SID='+user.getSessionid()
		}).then(function(response) {
			if(response.data.status == 'done') {
				alert('Password updated');
			} else {
				alert('cross site attacks doesn\'t work!!');
			}
		})
	};
});