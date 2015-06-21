var express = require('express');
var router = express.Router();

var dateIdeasCtrl = require('../controllers/dateIdeas');

// Date Ideas
router.get('/getAllTimes' , dateIdeasCtrl.getAllTimes );
router.put('/addNewTime/:nMonth/:nDay/:nYear/:nHour/:nMinutes/:timeZone' , dateIdeasCtrl.addNewTime);
router.delete('/deleteDateIdea/:id' , dateIdeasCtrl.deleteDateIdea );

router.put('/upVote/:id' , dateIdeasCtrl.upVote);
router.put('/downVote/:id' , dateIdeasCtrl.downVote);

module.exports = router;


