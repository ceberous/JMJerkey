(function () {

	function navigationGeneric () {
		return {
			restrict: 'EA',
			templateUrl: '/views/navigationDirective.html'
		};
	}

	angular
		.module('dateVoterApp')
		.directive('navigationGeneric' , navigationGeneric)
	;


})();