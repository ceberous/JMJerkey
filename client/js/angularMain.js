var teams = [];

var app = angular.module('teamTrackerApp' , ['ui.router'])

	.run(function($rootScope) {
			// $rootScope.teams = teams;
	})

	.config(['$stateProvider' , '$urlRouterProvider' , '$locationProvider' ,
		
		function($stateProvider , $urlRouterProvider , $locationProvider) {

			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false
			});

			$urlRouterProvider.otherwise('/');

			$stateProvider

				.state('home' , {
					url: '/',
					templateUrl: 'views/home.html',
					controller: 'HomeCtrl'
				})

			;

		}

	])


	.controller('HomeCtrl' , ['$scope' , '$rootScope' , '$http' , function($scope , $rootScope , $http) {


		$scope.newFirstName;
		$scope.newLastName;
		$scope.isAdmin = false;
	
		// HELPER FUNCTIONS
		// ==============================================
			var getAllTeams = function() {
				$http.get('/api/teams').success(function(data) {
					$scope.teams = data;
					if ($scope.teams.length < 1) {createNewTeam(1);}
					console.log('Current Total Teams = ' + $scope.teams.length);
				});
			};

			var getAllTeamsWithAddPlayer = function(newName) {
				$http.get('/api/teams').success(function(data) {
					$scope.teams = data;
					addPlayer(newName);
				});
			};

			var addPlayer = function(newName) {
				var totalTeams = $scope.teams.length;
				var currentTeam = $scope.teams[totalTeams - 1];
				var i = totalTeams + 1;
				if (currentTeam.players.length < 5) {
					$http.put('/api/teams/' + totalTeams + '/' + newName).success(function(data) {
						$scope.newFirstName = '';
						$scope.newLastName = '';
						getAllTeams();
					});
				} else {
					// Make Blank Team
					createNewTeamWithPlayerAdd( i , newName);
				}

			};

			var createNewTeamWithPlayerAdd = function( i , newName) {
				$http.put('/api/teams/' + i).success(function(data) {
					getAllTeamsWithAddPlayer(newName);
				});
			};

			var createNewTeam = function(i) {
				$http.put('/api/teams/' + i).success(function(data) {
					getAllTeams();
				});
			};	

			var getNewName = function( newFirstName , newLastName ) {
				if (newFirstName && newLastName) {
					return newFirstName + ' ' + newLastName;
				}
				else if (newFirstName && !newLastName) {
					return newFirstName;
				}
				else if (newLastName && !newFirstName ) {
					return newLastName;
				}

			};
		// =========== END HELPERS ======================

		// Grab all the Current Teams for the Inital View
		getAllTeams();


		// CALLABLE VIEW FUNCTIONS
		// ==============================================
			$scope.submitNewPlayer = function(newFirstName , newLastName) {
				if (newFirstName === 'admin') {
					$scope.isAdmin = true;
					$scope.newFirstName = '';
				} else if (newFirstName === 'back')  {
					$scope.isAdmin = false;
					$scope.newFirstName = '';
				}
				else {

					var newName = getNewName(newFirstName , newLastName);
				
					if (newName) {
						console.log('Sumbitted Player Name = ' + newName);
						getAllTeamsWithAddPlayer(newName);
					} 
					else {
						console.log('Need to Enter a Name Brah');
					}	

				}		

			};

			$scope.deleteTeam = function ( teamNumber ) {
				$http.delete('/api/teams/' + teamNumber ).success(function (data) {
					getAllTeams();
				});
			};	

			$scope.deletePlayer = function( teamNumber , playerID ) {
				$http.delete('/api/teams/' + teamNumber + '/' + playerID ).success(function(data) {
					getAllTeams();
				});
			};

		// =========== END VIEW FUNCTIONS ===============


		
	}])



;




