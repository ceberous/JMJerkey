var express = require('express');
var router = express.Router();

var mainCtrl = require('../controllers/main');
var expenseCtrl = require('../controllers/expenses');
var incomeCtrl = require('../controllers/incomes');

// expenses
router.get('/expenses' , expenseCtrl.getAllExpenses);
router.put('/newExpense/:name/:amount/:reoccuring/:day/:category' , expenseCtrl.newExpense);
router.put('/editExpense/:expenseID/:name/:amount/:reoccuring/:day/:category' , expenseCtrl.editExpenseID);
router.delete('/expenses/deleteID/:id' , expenseCtrl.deleteExpenseID);

router.put('/newExpenseCategory/:name' , expenseCtrl.newCategory);
router.put('/editExpenseCategory/:categoryID/:newName' , expenseCtrl.editExpenseCategory);
router.get('/allCategories/' , expenseCtrl.getAllCategories);
router.delete('/deleteExpenseCategory/:categoryID' , expenseCtrl.deleteCategory);

// incomes
router.get('/getAllIncomes' , incomeCtrl.getAllIncomes);
router.put('/addNewIncome/:name/:amount/:reoccuring/:day' , incomeCtrl.newIncome);
router.delete('/deleteIncome/:incomeID' , incomeCtrl.deleteIncome);

module.exports = router;


