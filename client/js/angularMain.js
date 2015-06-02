var teams = [];

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

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

		$scope.editingStatus = false;
		$scope.editingVariable;
		$scope.showExpenses = false;
		$scope.categories;
		$scope.newCategoryName;
		$scope.newCategoryNameInput;
		$scope.editingCategoryNameBool = false;

		$scope.totalDeductions;
		$scope.totalIncome;
		// $scope.finalMonthNet;
	
		// HELPER FUNCTIONS
		// ==============================================
			var getAllCategories = function() {
				$http.get('/api/allCategories').success(function(data) {
					console.log(data);
					$scope.categories = data;
				});
			};

			var getAllExpenses = function() {
				$http.get('/api/expenses').success(function(data) {
					$scope.expenses = data;
					
					getExpenseTotal(data);
				});
			};

			var getExpenseTotal = function(expenses) {
				var q = 0;
				var localTotal = [];
				while( q < expenses.length ) {
					localTotal.push(expenses[q].amount);
					q = q + 1;
				}
				p = eval(localTotal.join('+'));
				$scope.totalDeductions = (p).formatMoney(2);
				console.log('Total Deductions = ' + $scope.totalDeductions);
				getAllIncomes();
			};

			var toggleShowExpensesHelper2 = function() {
				var tempBool = !$scope.showExpenses;
				$scope.showExpenses = tempBool;
				getAllCategories();
			}

			var toggleShowExpensesHelper = function() {
				var tempBool = !$scope.showExpenses;
				$scope.showExpenses = tempBool;
			};

			var toggleEditingStatusHelper = function() {
				var tempBool = !$scope.editingStatus;
				$scope.editingStatus = tempBool;
				return;
			};

			var toggleEditingCategoryName = function() {
				var tempBool = !$scope.editingCategoryNameBool;
				$scope.editingCategoryNameBool = tempBool;
				return;
			};

			var getAllIncomes = function() {
				$http.get('/api/getAllIncomes').success(function(data){
					$scope.allIncomes = data;
		
					getIncomeTotal(data);
				});
			};

			var getIncomeTotal = function(incomes) {
				var p = 0;
				var localTotal = [];
				while( p < incomes.length ) {
					localTotal.push(parseFloat(incomes[p].amount.toString()));
					p = p + 1;
				}

				p = parseFloat(eval(localTotal.join('+')));
				$scope.totalIncome = (p).formatMoney(2);
	
				// var formattedTotal = ($scope.totalIncome - $scope.totalDeductions).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				$scope.finalMonthNet = ($scope.totalIncome - $scope.totalDeductions).formatMoney(2);
				console.log('$scope.finalMonthNet = ' + $scope.finalMonthNet);
				if (!$scope.finalMonthNet) {$scope.finalMonthNet = 0;}
				return;
			};			
		// =========== END HELPERS ======================


		// CALLABLE VIEW FUNCTIONS
		// ==============================================	
			$scope.getAllExpenses = function() {
				getAllExpenses();
			};

			$scope.editExpense = function(expenseID) {

				var localExpense = $.grep($scope.expenses , function(e) {
					return e._id == expenseID;
				});

				$scope.editExpenseModalID = expenseID;
				$scope.editExpenseModalName = localExpense[0].name;
				$scope.editExpenseModalAmount = localExpense[0].amount;
				$scope.editExpenseModalReoccuring = localExpense[0].reoccuring;
				$scope.editExpenseModalDueDay = localExpense[0].dueDay;
				$scope.editExpenseModalCategory = localExpense[0].category;

				$("#myModal").modal('show');

				getAllCategories();

			};

			$scope.saveEditExpense = function() {

				if (document.getElementById('dueDateDayID')) {
					var day = document.getElementById('dueDateDayID').value;
				}

			 	$scope.editExpenseModalAmount =	($scope.editExpenseModalAmount).formatMoney(2);

				var changes = {
					name: $scope.editExpenseModalName.toString(),
					amount: $scope.editExpenseModalAmount,
					reoccuring: $scope.editExpenseModalReoccuring,
					dueDay: day,
					category: $scope.editExpenseModalCategory.toString()
				};

				$http.put('/api/editExpense/' + $scope.editExpenseModalID + 
					'/' + changes.name + '/' + changes.amount + '/' + changes.reoccuring + 
					'/' + changes.dueDay + '/' + changes.category)

					.success(function(data){
						getAllExpenses();
					})
				;
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
				console.log('editingStatus = ' + tempBool);
				console.log('getting categories .. .');
				getAllCategories();
			};

			$scope.toggleShowExpenses = function() {
				toggleShowExpensesHelper();
			};

			$scope.newExpenseCategory = function() {
				var input = document.getElementById('editingInput').value.toString();
				$http.put('/api/newExpenseCategory/' + input).success(function(data){
					console.log('Added New Category : ' + input);
					document.getElementById('editingInput').value = '';
					getAllCategories();
				});
			};

			$scope.toggleEditingCategoryName = function(categoryID) {
				$("#"+categoryID+"\"").toggleClass('hidden');
				toggleEditingCategoryName(categoryID);
			};

			$scope.editExpenseCategory = function(categoryID) {
				var localCategory = $.grep($scope.categories , function(e) {
					return e._id == categoryID;
				});

				$scope.editCategoryModalID = categoryID;
				$scope.editCategoryModalName = localCategory[0].name;


				$("#myCategoryModal").modal('show');

			};

			$scope.saveEditExpenseCategory = function() {
				$http.put('/api/editExpenseCategory/' + $scope.editCategoryModalID + '/' + $scope.editCategoryModalName.toString()).success(function(data){
					getAllCategories();
				});
			};

			$scope.deleteExpenseCategoryID = function(categoryID) {
				$http.delete('/api/deleteExpenseCategory/' + categoryID).success(function(data){
					getAllCategories();
				});
			};
		// =========== END VIEW FUNCTIONS ===============

		getAllExpenses();
		getAllIncomes();
		
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

		var getAllExpenses = function() {
			$http.get('/api/expenses').success(function(data) {
				$scope.expenses = data;
				
				getExpenseTotal(data);
			});
		};

		var getExpenseTotal = function(expenses) {
			var q = 0;
			var localTotal = [];
			while( q < expenses.length ) {
				localTotal.push(expenses[q].amount);
				q = q + 1;
			}
			p = parseFloat(eval(localTotal.join('+')));
			$scope.totalDeductions = (p).formatMoney(2);
			if (!$scope.totalDeductions) {$scope.totalDeductions = 0;}
		};				

		getAllCategories();
		getAllExpenses();

		$scope.addNewExpense = function() {

			var dueDateDay = 1;
			if (document.getElementById('dueDateDayID')) {
				dueDateDay = document.getElementById('dueDateDayID').value;
			}

			var localCategory;
			if (document.getElementById('newExpenseCategoryID')) {
				localCategory = document.getElementById('newExpenseCategoryID').value;
			}

			var goHome = function() {
				$state.go('home');
			}

			var bool = $scope.reoccuring;

			$scope.newExpenseAmount = ($scope.newExpenseAmount).formatMoney(2);

			$http.put('/api/newExpense/' + $scope.newExpenseName + '/' + $scope.newExpenseAmount + '/' + bool + '/' + dueDateDay + '/' + localCategory)
				.success(function(data) {
					console.log('Back in /api/newExpense .success()');
					goHome();
				})
			;
			
		};

	}])	

	.controller('NewIncomeCtrl' , ['$scope' , '$rootScope' , '$http' , function($scope , $rootScope , $http) {

		$scope.allIncomes;
		$scope.newIncomeName;
		$scope.newIncomeAmount;
		$scope.reoccuring = false;
		$scope.positiveAmount;

		var getAllIncomes = function() {
			$http.get('/api/getAllIncomes').success(function(data){
				$scope.allIncomes = data;
	
				getIncomeTotal(data);
			});
		};

		var getIncomeTotal = function(incomes) {
			var p = 0;
			var localTotal = [];
			while( p < incomes.length ) {
				localTotal.push(incomes[p].amount);
				p = p + 1;
			}

			p = parseFloat(eval(localTotal.join('+')));
			$scope.positiveAmount = (p).formatMoney(2);
			if (!$scope.positiveAmount) {$scope.positiveAmount = 0;}
			return;
		};


		$scope.addNewIncome = function() {

			var day = document.getElementById('dueDateDayID').value;

			$http.put('/api/addNewIncome/' + $scope.newIncomeName.toString() + '/' + $scope.newIncomeAmount + '/' + $scope.reoccuring + '/' + day)
				.success(function(data){
					$scope.newIncomeName = '';
					$scope.newIncomeAmount = 0;
					$scope.reoccuring = false;
					document.getElementById('dueDateDayID').value = 1;
					getAllIncomes();
				})
			;
		};

		$scope.editIncomeID = function(incomeID) {
				var localIncome = $.grep($scope.allIncomes , function(e) {
					return e._id == incomeID;
				});

				$scope.editIncomeModalID = incomeID;
				$scope.editIncomeModalName = localIncome[0].name;
				$scope.editIncomeModalAmount = localIncome[0].amount;
				$scope.editIncomeModalReoccuring = localIncome[0].reoccuring;
				$scope.editIncomeModalDueDay = localIncome[0].dueDay;

				$("#myIncomeModal").modal('show');			
		};

		$scope.saveEditIncome = function() {
			var day = document.getElementById('dueDateDayID').value;

			$http.put('/api/editIncome/' + $scope.editIncomeModalID  + '/' + $scope.editIncomeModalName.toString() + '/' + $scope.editIncomeModalAmount + '/' + $scope.editIncomeModalReoccuring + '/' + day).success(function(data){
				$scope.newIncomeName = '';
				$scope.newIncomeAmount = null;
				$scope.reoccuring = false;
				document.getElementById('dueDateDayID').value = 1;
				getAllIncomes();
			});				
		};

		$scope.deleteIncomeID = function(incomeID) {
			$http.delete('/api/deleteIncome/' + incomeID).success(function(data){
				getAllIncomes();
			});
		};

		getAllIncomes();

	}])	
	
;




