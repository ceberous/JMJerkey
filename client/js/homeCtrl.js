(function () {


	var addEvent = function( elem , type , eventHandle ) {
		if (elem == null || typeof(elem) == 'undefined') return;
		
		if (elem.addEventListener) {
			elem.addEventListener( type , eventHandle , false );
		} 
		else if (elem.attachEvent) {
			elem.attachEvent( "on" + type , eventHandle );
		}
		else {
			elem["on" + type] = eventHandle;
		}
	};

	function getWindowDetails() {
		// var w = $('#wrapperDiv').width();
		// var h = $('#wrapperDiv').height();
		var delay = 0;
		setTimeout(function() {

		} , delay);

	}

	homeCtrl.$inject = ['$http'];

	function homeCtrl($http) {
		// addEvent(window , "resize" , getWindowDetails);		
		var vm = this;

		vm.showNewDateForm = false;
		vm.newDate;
		vm.enableInput = true;
		vm.newDate; 		
		vm.newStartTime;


		var localTime = new Date().toString();
			console.log(localTime);
		localTime = localTime.split(' ');
		localTime = localTime.pop();
		localTime = localTime.split('');
		localTime = localTime[1] + localTime[2] + localTime[3];
		vm.timeZone = localTime;
			console.log(vm.timeZone);	


		var getAllTimes = function() {
			$http.get('/api/getAllTimes')
				.success(function(data){
					vm.allTimes = data;	
					console.log(vm.allTimes);				
				})
			;
		};
		getAllTimes();
		

		vm.newDateIdea = function() {
			vm.enableInput = !vm.enableInput;
			vm.showNewDateForm = !vm.showNewDateForm;
		};

		vm.cancelNewDateIdea = function() {
			vm.enableInput = !vm.enableInput;
			vm.showNewDateForm = !vm.showNewDateForm;			
		};		

		vm.submitNewDateIdea = function() {

			// var s = $('#startDate').val();
			// var startDate = new Date(s.replace(/-/g , '/').replace('T' , ' '));

			var nD = vm.newDate.toString().split(' ');
			var nMonth = nD[1];
			var nDay = nD[2];
			var nYear = nD[3];
				console.log(nMonth + ' , ' + nDay + ' , ' + nYear);

			var nT = vm.newStartTime.toString().split(' ');
			nT = nT[4];
			nT = nT.split(':');
			var nHour = nT[0];
			var nMinutes = nT[1];
				console.log(nHour + ' : ' + nMinutes);

			$http.put('/api/addNewTime/' + nMonth + '/' + nDay + '/' + nYear + '/' + nHour + '/' + nMinutes + '/' + localTime)
				.success(function(data) {
					vm.enableInput = !vm.enableInput;
					vm.showNewDateForm = !vm.showNewDateForm;
					getAllTimes();
				})
			;

		};

		vm.deleteDateIdea = function(id) {
			$http.delete('/api/deleteDateIdea/' + id)
				.success(function(data){
					getAllTimes();
				})
			;
		};

		vm.editDateIdea = function() {

		};

		vm.upVote = function(id) {
			// Find by id and upvote
			$http.put('/api/upVote/' + id )
				.success(function(data) {
					getAllTimes();
				})
			;			
		};

		vm.downVote = function(id) {
			// Find by id and downvote
			$http.put('/api/downVote/' + id )
				.success(function(data) {
					getAllTimes();
				})
			;
		};

	}


	angular
		.module('dateVoterApp')
		.controller('homeCtrl' , homeCtrl)
	;

})();