var express = require('express');
var router = express.Router();
var ctrlTeams = require('../controllers/teams');


// locations

router.get('/teams' , ctrlTeams.getAllTeams);

router.put('/teams/:teamNumber/' , ctrlTeams.teamCreate);
router.put('/teams/:teamNumber/edit/:newTeamNumber' , ctrlTeams.editTeam);
router.get('/teams/:teamNumber' , ctrlTeams.getTeamNumber);
router.delete('/teams/:teamNumberID' , ctrlTeams.deleteTeam);


router.put('/teams/:teamNumber/:newPlayer' , ctrlTeams.playerCreate);
router.put('/teams/update/:teamNumber/:playerID/:newName' , ctrlTeams.editPlayer);
router.delete('/teams/:teamNumber/:playerID' , ctrlTeams.playerDelete);

router.get('/getCurrentTeam/' , ctrlTeams.getCurrentTeamTrial);
router.put('/makeCurrentTeam/' , ctrlTeams.makeCurrentTeam);
router.put('/updateCurrentTeam/:number' , ctrlTeams.updateCurrentTeam );

//router.put('/teams/:teamnumber/:newName' , ctrlTeams.playerAdd);

module.exports = router;


