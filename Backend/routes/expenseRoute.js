// expenseRoute.js
const express = require('express');
const route = express.Router();
const expenseController = require('../controller/expenseController');
const auth = require("../middleware/auth");

const Expense = require('../models/expenseModel'); // for pieChart the expense route has been located

route.post('/expenses',auth,expenseController.createExpense);

route.post('/pieChart',auth,expenseController.getExpense);




route.get('/expenses', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    };

    // Aggregate expenses by category and calculate the total amount for each category
    const aggregatedExpenses = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Send data as response
    res.json(aggregatedExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = route;
