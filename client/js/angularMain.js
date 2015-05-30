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
		$scope.NPTeamNumber;
		$scope.isAdmin = false;
	
		// HELPER FUNCTIONS
		// ==============================================
			var getAllTeams = function() {
				$http.get('/api/teams').success(function(data) {
					$scope.teams = data;

					if ($scope.teams.length < 1) {createNewTeam(1); return;}
					console.log('Current Total Teams = ' + $scope.teams.length);

					var localTeams = $scope.teams;
					var workingTeam;
					var i=0;
					while (i < localTeams.length) {
						if (localTeams[i].players) {
							if (localTeams[i].players.length < 5) {
								workingTeam = localTeams[i];
								console.log('workingTeamNumber = ' + workingTeam.teamNumber);
								$scope.NPTeamNumber = workingTeam.teamNumber;
								break;
							} 
						}
						i = i + 1;
					}

					

				});
			};

			var getAllTeamsWithAddPlayer = function(newName) {
				$http.get('/api/teams').success(function(data) {
					$scope.teams = data;
					var workingTeam;
					var workingTeamNumber = $scope.teams.length;

					if ($scope.teams[workingTeamNumber-1].players >= 5) {
						var i = workingTeamNumber + 1;
						createNewTeamWithPlayerAdd( i , newName);
					}

					var localTeams = $scope.teams;
					var i=0;					
					while (i < localTeams.length) {
						if (localTeams[i].players) {
							if (localTeams[i].players.length < 5) {
								workingTeam = localTeams[i];
								workingTeamNumber = workingTeam.teamNumber;
								console.log('workingTeamNumber = ' + workingTeam.teamNumber);
								break;
							}
							break; 
						}
						i = i + 1;
					}
					
					addPlayer(newName , workingTeamNumber);
				});
			};

			var addPlayer = function(newName , workingTeamNumber ) {
				var totalTeams = $scope.teams.length;
				
				var currentTeam = $scope.teams[totalTeams - 1];
				var i = totalTeams + 1;
				console.log('Trying to Add Player : ' + newName + 'to Team #: ' + workingTeamNumber);
				if (currentTeam.players.length < 5) {
					$http.put('/api/teams/' + workingTeamNumber + '/' + newName).success(function(data) {
						$scope.newFirstName = '';
						$scope.newLastName = '';
						getAllTeams();
					});
				} else {
					// Make Blank Team
					console.log('Team #: ' + workingTeamNumber + ' was too full');
					console.log('Making new Team #: ' + i);
					createNewTeamWithPlayerAdd( i , newName);
				}

			};

			var editPlayerHelper = function(teamNumber , playerID , newName) {
				$http.put('/api/teams/update/' + teamNumber + '/' + playerID + '/' + newName).success(function(data) {
					$scope.teams = data;
				});
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

			var getAllTeamsWithEditPlayer = function(newName) {

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
						console.log('Submitted Player Name = ' + newName);
						getAllTeamsWithAddPlayer(newName);
					} 
					else {
						console.log('Need to Enter a Name Brah');
					}	

				}		

			};

			$scope.deletePlayer = function( teamNumber , playerID ) {
				$http.delete('/api/teams/' + teamNumber + '/' + playerID ).success(function(data) {
					getAllTeams();
				});
			};

			$scope.editPlayer = function( teamNumber , playerID ) {
				if ($scope.newFirstName === 'admin') {
					$scope.isAdmin = true;
					$scope.newFirstName = '';
				} else if ($scope.newFirstName === 'back')  {
					$scope.isAdmin = false;
					$scope.newFirstName = '';
				}
				else {

					var newName = getNewName($scope.newFirstName , $scope.newLastName);
				
					if (newName) {
						console.log('Submitted Player Name = ' + newName);
						editPlayerHelper(teamNumber , playerID , newName);
					} 
					else {
						console.log('Need to Enter a Name Brah');
					}	

				}					
			};

			$scope.deleteTeam = function ( teamNumberID ) {
				console.log('Sent from home.html , DELETE Team #ID: ' + teamNumberID);
				$http.delete('/api/teams/' + teamNumberID ).success(function(data) {
					getAllTeams();
				});
			};		

			$scope.editTeam = function ( teamNumber ) {
				var id = 'newTeam#' + teamNumber;
				var newNumber = document.getElementById(id).value;
				console.log('newTeamNuber should = ' + newNumber);
				$http.put('/api/teams/' + teamNumber + '/edit/' + newNumber ).success(function(data) {
					getAllTeams();
				});
			};

		// =========== END VIEW FUNCTIONS ===============


		
	}])



;




