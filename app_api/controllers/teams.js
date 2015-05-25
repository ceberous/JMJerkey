var mongoose = require('mongoose');

var Team = mongoose.model('Team');
var Stats = mongoose.model('Stats');

var request = require('request');
var apiOptions = {
	server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	// apiOptions.server = "https:/getting-mean-loc8r.herokuapp.com";
}

var requestOptions = {
	url: 'http://yourapi.com/api/path',
	method: "GET",
	json: {},
	qs: {
		offset: 20
	}
};

request( requestOptions , function( err , response , body ) {

	if (err) {console.log(err);}
	else if (response.statusCode === 200) {console.log(body);}
	else {console.log(response.statusCode);}

});

var sendJSONResponse = function( res , status , content ) {
    res.status(status);
    res.json(content);
};

var doAddPlayer = function( req , res , team ) {

	if (!team) {sendJSONResponse(res , 404 , {"message": "team not found"});}
	else {

		// Push into Collection
		team.players.push({
			player: req.params.newPlayer
		});

		// Save Object to Database
		// Update Average Rating
		// Return the Saved Review
		team.save(function( err , team ) {
			var thisTeam;
			if (err) {sendJSONResponse( res , 404 , err );}
			else {
				thisTeam = team.players[team.players.length - 1];
				sendJSONResponse( res , 201 , thisTeam );
			}
		});

	}

};



// GET ALL TEAMS
module.exports.getAllTeams = function(req, res) {

	console.log(req.params.teamNumber);

	Team.find({} , function( err , teams ){
		sendJSONResponse( res , 200 , teams);
	});

};

module.exports.getTeamNumber = function( req , res ) {

	// existance
	if (req.params && req.params.teamNumber) {

		Team.find({"teamNumber": req.params.teamNumber})
			// Read ONE location
			.exec(function( err , team ) {
				if (!err) {
					sendJSONResponse( res , 200 , team );
				} else {
					sendJSONResponse( res , 404 , {
						"message": "locationid not found in database"
					});
				}
			})

		;

	} 
	else {
		sendJSONResponse( res , 404 , {
			"message" : "No Locationid in request"
		});
	}


};	

module.exports.makeCurrentTeam = function( req , res ) {
	Stats.create(
		{
			currentTeam: 1,
		},
		function( err , obj ) {
			if (err) {
				sendJSONResponse( res , 400 , err );
			}
			else {
				sendJSONResponse( res , 201 , obj );
			}			
		}
	);
};	


module.exports.getCurrentTeam = function( req , res ) {
	Stats.findOne().select('currentTeam')
		.exec(function( err , object ) {
			console.log('Logging getCurrentTeam() { ' + '\n\t' + object+ '\n}');
			sendJSONResponse( res , 200 , object );
		})
	;
};

module.exports.updateCurrentTeam = function( req , res ) {
	Stats.findOne( {} , function( err , object ) {
		object.currentTeam = req.params.number;
		object.save();
		console.log('Logging from updateCurrentTeam() { ' + '\n\t' + object + '\n}');
		sendJSONResponse( res , 200 , object );
	});
};

module.exports.teamCreate = function( req , res ) {

	Team.create(
		{
			teamNumber: req.params.teamNumber,
		},
		function( err , team ) {
			if (err) {
				sendJSONResponse( res , 400 , err );
			}
			else {
				sendJSONResponse( res , 201 , team );
			}			
		}
	);

	console.log("Should of Created a team with the number : " + req.params.teamNumber);

};

module.exports.deleteTeam = function( req , res ) {

	var teamNumber = req.params.teamNumber;

	if (teamNumber) {

		Team.findOne({teamNumber: teamNumber})
			.select('teamNumber players')
			.exec(function( err , team ) {
				if (err) {sendJSONResponse(res , 400 , err);}
				else {
					team.remove(function (err) {
						if (err) {console.log(err);}
						else {
							console.log('removed');
							return res.send('');
						}
					});
				}

			})
		;

	}
	else {
		sendJSONResponse( res , 404 , {
			"message": "Not Found, teamname required"
		});
	}

};

module.exports.playerAdd = function( req , res ) {

	console.log("\n(Should Be Adding) { ");	
	var newPlayer = req.params.newPlayer;
	console.log('\tNew Player : ' + newPlayer);
	var teamNumber = req.params.teamNumber;
	console.log('\tTo Team Number #: ' + teamNumber);
	console.log('}\n');

	var foundTeam;

	if (teamNumber) {

		Team.findOne({teamNumber: teamNumber})
			.select('teamNumber players')
			.exec(function( err , team ) {
				if (err) {sendJSONResponse(res , 400 , err);}
				else {
					doAddPlayer( req , res , team );
				}

			})
		;


		/*
		Team.find({})
			.select({teamNumber: teamNumber})
			.exec(function( err , team ) {

				if (err) {sendJSONResponse(res , 400 , err);}
				else {
					team.push({
						players: newPlayer
					});
					team.save(function(err){
						if (err) {return err;}
						else {console.log('Team Memeber Added');}
					});
					console.log(team);
				}

			})
		;
		// doAddPlayer( req , res , foundTeam );
		*/

	}
	else {
		sendJSONResponse( res , 404 , {
			"message": "Not Found, teamname required"
		});
	}

};

// CREATE
module.exports.locationsCreate = function(req , res) {
    
	Loc.create({

		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(","),
		coords: [parseFloat(req.body.lng) , parseFloat(req.body.lat)],
		openingTimes: [
			{
				days: req.body.days1,
				opening: req.body.opening1,
				closing: req.body.opening1,
				closed: req.body.closed1,
			},
			{
				days: req.body.days2,
				opening: req.body.opening2,
				closing: req.body.opening2,
				closed: req.body.closed2,				
			}
		]

		},

		function(err , location ) {
			if (err) {
				sendJSONResponse( res , 400 , err );
			}
			else {
				sendJSONResponse( res , 201 , location );
			}
		}

	);

};  

// READ
module.exports.locationsReadOne = function( req , res ) {

	// existance
	if (req.params && req.params.locationid) {

		Loc.findById(req.params.locationid)
			// Read ONE location
			.exec(function( err , location ) {
				if (!err) {
					sendJSONResponse( res , 200 , location );
				} else {
					sendJSONResponse( res , 404 , {
						"message": "locationid not found in database"
					});
				}
			})

		;

	} 
	else {
		sendJSONResponse( res , 404 , {
			"message" : "No Locationid in request"
		});
	}

};

// UPDATE
module.exports.locationsUpdateOne = function(req , res) {

	if (!req.params.locationid) {
		sendJSONResponse(res , 404 , {
			"message": "Not found, locationid is required"
		});
		return;
	}

	Loc.findById(req.params.locationid)
		.select('-reviews -rating') // Retrieve everything EXCEPT reviews and ratings
		.exec(function(err , location) {

			if (!location) {
				sendJSONResponse(res , 404 , {
					"message": "locationid not found"
				});
				return;
			}
			else if (err) {
				sendJSONResponse(res , 404 , err);
				return;
			}

			location.name = req.body.name;
			location.address = req.body.address;
			location.facilities = req.body.facilities.split(',');
			location.coords = [parseFloat(req.body.lng) , parseFloat(req.body.lat)];

			location.openingTimes = [
				{
					days: req.body.days1,
					opening: req.body.opening1,
					closing: req.body.opening1,
					closed: req.body.closed1,
				},
				{
					days: req.body.days2,
					opening: req.body.opening2,
					closing: req.body.opening2,
					closed: req.body.closed2,				
				}
			];

			location.save(function(err , location) {
				if (err) {sendJSONResponse(res , 404 , err);}
				else {
					sendJSONResponse( res , 200 , location);
				}
			});

		})

	;

};

// DELETE (instant)
module.exports.locationsDeleteOne = function(req , res) {

	var locationid = req.params.locationid;

	if (locationid) {

		Loc.findByIdAndRemove(locationid)
			.exec(function(err , location) {

				if (err) {sendJSONResponse(res , 404 , err); return;}

				sendJSONResponse( res , 204 , null);

			})
		;

	}
	else {
		sendJSONResponse(res , 404 , {
			"message": "No locationid provided"
		});
	}

};

// DELETE (with final preperations)
module.exports.locationsDeleteOneWithPrep = function(req , res) {

	var locationid = req.params.locationid;

	if (locationid) {

		Loc.findById(locationid)
			.exec(function(err , location) {

				if (err) {sendJSONResponse(res , 404 , err); return;}

				// Perform Final Preperations Here
					// 1.)
					// 2.)
					// 3.)

				// After Steps are completed , finally delete it
				Loc.remove(function(err , location) {
					if (err) {sendJSONResponse(res , 404 , err); return;}
					sendJSONResponse( res , 204 , null);
				});	

			})
		;

	}
	else {
		sendJSONResponse(res , 404 , {
			"message": "No locationid provided"
		});
	}

};




















