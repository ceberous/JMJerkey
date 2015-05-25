var teams = [];

var team1 = {number: 1};
var team2 = {number: 2};
var team3 = {number: 3};
var team4 = {number: 4};
var team5 = {number: 5};
var team6 = {number: 6};
var team7 = {number: 7};
var team8 = {number: 8};
var team9 = {number: 9};
var team10 = {number: 10};

var app = angular.module('teamTrackerApp' , ['ui.router'])

	.run(function($rootScope) {
			$rootScope.teams = teams;
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

				.state('addPlayer' , {
					url: '/api/1/:playerName',
					templateUrl: 'views/home.html',
					controller: 'HomeCtrl'
				})

			;

		}

	])


	.controller('HomeCtrl' , ['$scope' , '$rootScope' , '$http' , function($scope , $rootScope , $http) {

		$scope.newFirstName;
		$scope.newLastName;
		$scope.currentTeam = 0;

		var getAllTeams = function() {

			return $http.get('/api/teams/').success(function(data){
				console.log(data);
				$scope.teams = data;
			});

		};

		$scope.teams = getAllTeams();

		var getCurrentTeam = function() {

			return $http.get('/api/getCurrentTeam/').success(function(data) {
				$scope.currentTeam = data.currentTeam;
				console.log('Current Team Pointer Now Set to := ' + $scope.currentTeam );
			});

		};

		getCurrentTeam();


		var updateCurrentTeam = function(currentTeamNumber) {

			// Needs to create a new Team.object
			$http.put('/api/teams/' + currentTeamNumber).success(function(data) {
				getAllTeams();
			});

		};	

		

		$scope.submitNewPlayerTrial = function() {

			console.log('Starting submitNewPlayerTrail()');

			$http.get('/api/getCurrentTeam')
				.success(function(data) {

					$scope.currentTeam = data.currentTeam;

					executePlayerAdd($scope.currentTeam);

					// console.log('$scope.teams = ' + $scope.teams);
					// console.log('$scope.currentTeam = ' + $scope.currentTeam);
					// console.log('GET /api/getCurrentTeam returns : \n' + data);

					/*
					return $http.put('/api/teams' + data.currentTeam + '/' + newName)
						.success(function(data) {
							getAllTeams();
						})
					;
					*/


				})
			;

		};

		var executePlayerAdd = function( currentTeam ) {
			console.log(currentTeam);
			var workingTeam = currentTeam - 1; 
			console.log(workingTeam);

			// If valid emptyTeam 
			if ($scope.teams[workingTeam]) {
				// console.log('Working TeamNumber = ' + $scope.teams[workingTeam].teamNumber);

				var workingTeamPlayers = $scope.teams[workingTeam].players

				if (workingTeamPlayers.length <= 4) {
					var newName = $scope.newFirstName + ' ' + $scope.newLastName;
					$scope.newFirstName = '';
					$scope.newLastName = '';

					$http.put('/api/teams/' + currentTeam + '/' + newName )
						.success(function(data) {
							console.log(data);
							getAllTeams();
						})
					;			

				} 
				else {
					// index $scope.currentTeam
					var i = $scope.currentTeam + 1;
					$http.put('/api/updateCurrentTeam/' + i).success(function(data) {
						console.log('DATA Object Returned from $http.put(/api/updateCurrentTeam/)\n\t' + data.currentTeam);
						


					});
				}
			}
			else {
				// Create an Empty Team and fill $scoped  newName? 
				$http.put('/api/teams/' + currentTeam).success(function(data) {

					var newName = $scope.newFirstName + ' ' + $scope.newLastName;
					$scope.newFirstName = '';
					$scope.newLastName = '';

					$http.put('/api/teams/' + currentTeam + '/' + newName )
						.success(function(data) {
							console.log(data);
							getAllTeams();
						})
					;


				});
			}
			/*
			console.log('Players of Working TeamNumber = ');
			workingTeamPlayers.forEach(function(i) {
				console.log('\t' + i.player);
			});
			*/

		};	
		


		$scope.submitNewPlayer = function() {

			$scope.teamNumber = getCurrentTeam();

			var newName = $scope.newFirstName + ' ' + $scope.newLastName;

			$scope.newFirstName = '';
			$scope.newLastName = '';

			$http.put('/api/teams/' + $scope.teamNumber + '/' + newName )
				.success(function(data) {
					console.log(data);
					getAllTeams();
				})
			;
		
		};


		$scope.deleteTeam = function(teamNumber) {

			$http.delete('/api/teams/' + teamNumber).success(function (data) {
				console.log(data);
				getAllTeams();
			});

		};

		
	}])



;




