var mongoose = require('mongoose');

var statsSchema = new mongoose.Schema({
	currentTeam: {type: Number , default: 1}
});


mongoose.model('Stats' , statsSchema);