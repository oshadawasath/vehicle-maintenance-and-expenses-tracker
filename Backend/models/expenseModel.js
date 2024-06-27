const mongoose = require('mongoose');
const User = require("../models/userModel");


const expenseSchema = new mongoose.Schema({
  
  plateNo: {
    type: String,
    required: [true, 'Plate number is required'],
    validate: {
      validator: function(v) {
        // Validation function checks if plateNo consists of letters and numbers in a mixed pattern
        return /^[A-Za-z0-9]+$/.test(v);
      },
      message: props => `${props.value} is not a valid plate number!`
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  odometer: {
    type: Number,
    required: [true, 'Odometer reading is required'],
  },
  note: {
    type: String,
    required: [true, 'Note is required'],
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
  },
  selectedExpenseType: {
    type: String,
    enum: ['fuel', 'insurance', 'repair', 'miscellaneous', 'other'],
    required: [true, 'Expense type is required'],
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
