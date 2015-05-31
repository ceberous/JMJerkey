var teams = [];

var app = angular.module('personalFinanceApp' , ['ui.router'])

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

				.state('newExpense' , {
					url: '/',
					templateUrl: 'views/newExpense.html',
					controller: 'NewExpenseCtrl'
				})

				.state('newIncome' , {
					url: '/',
					templateUrl: 'views/newIncome.html',
					controller: 'NewIncomeCtrl'
				})

			;

		}

	])


	.controller('HomeCtrl' , ['$scope' , '$rootScope' , '$http' , function($scope , $rootScope , $http) {

		$scope.welcomeMessage = 'Personal Finance App';
		$scope.totalDeductions;
		$scope.totalIncome;
		$scope.finalMonthNet;
		$scope.editingStatus = false;
		$scope.editingVariable;
		$scope.showExpenses = false;
		$scope.categories;

		$scope.newFirstName;
		$scope.newLastName;
		$scope.NPTeamNumber;
		$scope.isAdmin = false;
	
		// HELPER FUNCTIONS
		// ==============================================
			var getAllTeams = function() {
				$http.get('/api/teams').success(function(data) {
					$scope.teams = data;
					var localTeams = $scope.teams;

					if ($scope.teams.length < 1) {createNewTeam(1); return;}
					console.log('Current Total Teams = ' + $scope.teams.length);
					
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

			var getAllCategories = function() {
				$http.get('/api/allCategories').success(function(data) {
					console.log(data);
					$scope.categories = data;
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

			var getAllExpenses = function() {
				$http.get('/api/expenses').success(function(data) {
					$scope.expenses = data;
					var i = 0;
					var total;
					while(i < data.length) {
						console.log('data['+i+'].amount = ' + data[i].amount);
						console.log(parseFloat(data[i].amount));
						total = total + parseInt(data[i].amount);
						i = i + 1;
					}
					$scope.totalDeductions = total;
					console.log('Total Deductions = ' + total);
					toggleShowExpensesHelper2();
					
				});
			};

			var toggleShowExpensesHelper2 = function() {
				var tempBool = !$scope.showExpenses;
				$scope.showExpenses = tempBool;
				getAllCategories();
			}

			var toggleShowExpensesHelper = function() {
				var tempBool = !$scope.showExpenses;
				$scope.showExpenses = tempBool;
			}
		// =========== END HELPERS ======================

		// Grab all the Current Teams for the Inital View
		// getAllTeams();


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



			$scope.getAllExpenses = function() {
				getAllExpenses();
			};


			$scope.deleteExpenseID = function(expenseID) {
				$http.delete('/api/expenses/deleteID/' + expenseID).success(function(data) {
					getAllExpenses();
				});
			};

			$scope.toggleEditingStatus = function() {
				var tempBool = !$scope.editingStatus;
				if (tempBool) {$scope.welcomeMessage = 'New Expense Category';}
				else {$scope.welcomeMessage = 'Personal Finance App';}
				$scope.editingStatus = tempBool;
			};

			$scope.toggleShowExpenses = function() {
				toggleShowExpensesHelper();
			};

			$scope.newExpenseCategory = function() {
				var input = document.getElementById('editingInput').value;
				$http.put('/api/newExpenseCategory/' + input).success(function(data){
					console.log('Added New Category : ' + input);

				});
			};
		// =========== END VIEW FUNCTIONS ===============

		getAllExpenses();
		
	}])

	.controller('NewExpenseCtrl' , ['$scope' , '$rootScope' , '$http' , '$state' , function($scope , $rootScope , $http , $state) {

		$scope.newExpenseName;
		$scope.newExpenseAmount;
		$scope.reoccuring = false;
		$scope.newExpenseCategory;
		$scope.weekly = false;
		$scope.biweekly = false;
		$scope.monthly = false;

		var getAllCategories = function() {
			$http.get('/api/allCategories').success(function(data) {
				$scope.categories = data;
			});
		};

		getAllCategories();

		$scope.addNewExpense = function() {

			var dueDateDay = document.getElementById('dueDateDayID').value;
			// var dueDateMonth = document.getElementById('dueDateMonthID').value;

			var localCategory = document.getElementById('newExpenseCategoryID').value;

			var goHome = function() {
				$state.go('home');
			}

			var bool = $scope.reoccuring.toString();

			$http.put('/api/newExpense/' + $scope.newExpenseName + '/' + $scope.newExpenseAmount + '/' + bool + '/' + dueDateDay + '/' + localCategory)
				.success(function(data) {
					console.log('Back in /api/newExpense .success()');
					goHome();
				})
			;
			
		};

	}])	

	.controller('NewIncomeCtrl' , ['$scope' , '$rootScope' , '$http' , function($scope , $rootScope , $http) {

		$scope.addNewIncome = function() {

		};

	}])	

;




