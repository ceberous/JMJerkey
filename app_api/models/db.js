var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/PersonalFinanceApp';
// var dbURI = 'mongodb://root:wuviqor6Yp@proximus.modulusmongo.net:27017/yDap8ytu';


mongoose.connect(dbURI);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});



// BRING IN YOUR SCHEMAS & MODELS
require('./expenses');
require('./income');
require('./categories');