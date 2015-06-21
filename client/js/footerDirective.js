(function () {

	function footerGeneric () {
		return {
			restrict: 'EA',
			templateUrl: '/views/footerGeneric.html'
		};
	}

	angular
		.module('dateVoterApp')
		.directive('footerGeneric' , footerGeneric)
	;


})();

