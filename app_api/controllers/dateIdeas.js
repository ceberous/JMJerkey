var mongoose = require('mongoose');

var DateIdea = mongoose.model('DateIdea');

// HELPER FUNCTIONS 
// ======================================
	var sendJSONResponse = function( res , status , content ) {
	    if (status) {res.status(status);}
	    res.json(content);
	};
// ========== END HELPER ==================

module.exports.getAllTimes = function ( req , res ) {
	DateIdea.find({})
		.exec(function(err , times) {
			if (err) {sendJSONResponse( res , 404 , err);}
			else {
				if (times) {
					sendJSONResponse( res , 200 , times);
				}
			}
		})
	;
};

module.exports.addNewTime = function( req , res ) {

	DateIdea.create(
		{
			month: req.params.nMonth,
			day: req.params.nDay,
			year: 	req.params.nYear,
			hour: req.params.nHour,
			minutes: req.params.nMinutes,
			timezone: 	req.params.timeZone,
			score: 0,
		},
		function( err , obj ) {
			if (err) {
				sendJSONResponse( res , 400 , err );
			}
			else {
				res.json(obj);
			}			
		}
	);

};

module.exports.deleteDateIdea = function( req , res ) {
	DateIdea.findByIdAndRemove(req.params.id)
		.exec(function( err , time) {
			if (err) {sendJSONResponse( res , 404 , err);}
			else {
				sendJSONResponse( res , 200 , null);
			}
		})
	;
};


module.exports.upVote = function( req , res ) {
	DateIdea.findById(req.params.id)
		.exec(function(err , time) {

			time.score = time.score + 1;

			time.save(function( err , expense ) {
				if (err) {sendJSONResponse( res , 404 , err );}

				sendJSONResponse( res , 200 , time);

			});

		})
	;
};

module.exports.downVote = function( req , res ) {
	DateIdea.findById(req.params.id)
		.exec(function(err , time) {

			time.score = time.score - 1;

			time.save(function( err , expense ) {
				if (err) {sendJSONResponse( res , 404 , err );}

				sendJSONResponse( res , 200 , time);

			});

		})
	;
};













