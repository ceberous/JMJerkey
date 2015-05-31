var mongoose = require('mongoose');
var Expense = mongoose.model('Expense');
var Category = mongoose.model('Category');


// HELPER FUNCTIONS 
// ======================================
	var sendJSONResponse = function( res , status , content ) {
	    if (status) {res.status(status);}
	    res.json(content);
	};
// ========== END HELPER ==================


module.exports.newExpense = function( req , res ) {

	var name = req.params.name || '' ;
	var amount = req.params.amount || 0.00 ;
	var reoccuring = req.params.reoccuring || false ;
	var dueDay = req.params.day || 1 ;
	var category = req.params.category || '';

	Expense.create(
		{
			name: name,
			amount: amount,
			reoccuring: reoccuring,
			dueDay: dueDay,
			category: category
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

module.exports.deleteID = function( req , res ) {
	Expense.findByIdAndRemove(req.params.id)
		.exec(function( err , offer) {
			if (err) {sendJSONResponse( res , 404 , err);}
			else {
				sendJSONResponse( res , 200 , null);
			}
		})
	;
};

module.exports.getAllExpenses = function( req , res ) {
	Expense.find({})
		.exec(function(err , expenses) {
			if (err) {sendJSONResponse( res , 404 , err);}
			else {
				if (expenses) {
					sendJSONResponse( res , 200 , expenses);
				}
			}
		})
	;
};

module.exports.newCategory = function( req , res ) {
	Category.create(
		{
			name: req.params.name
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

module.exports.getAllCategories = function ( req , res ) {
	Category.find({})
		.exec(function( err , categories ){
			if (err) {sendJSONResponse( res , 404 , err);}
			else {
				if (categories) {
					sendJSONResponse( res , 200 , categories);
				}
			}			
		})
	;
};		

// MISC
// ===================================

// ============END MISC===============

















