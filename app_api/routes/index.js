var express = require('express');
var router = express.Router();

var mainCtrl = require('../controllers/main');
var expenseCtrl = require('../controllers/expenses');

// expenses
router.get('/expenses' , expenseCtrl.getAllExpenses);
router.put('/newExpense/:name/:amount/:reoccuring/:day/:category' , expenseCtrl.newExpense);
router.delete('/expenses/deleteID/:id' , expenseCtrl.deleteID);
router.put('/newExpenseCategory/:name' , expenseCtrl.newCategory);
router.get('/allCategories/' , expenseCtrl.getAllCategories);

module.exports = router;


