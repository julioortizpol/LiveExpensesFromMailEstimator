const mongoose = require('mongoose');
const { Schema } = mongoose;

const expensesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  budgetCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
  },
  pureFromMail: {
    default: true,
    type: Boolean,
  },
  amount: {
    type: String,
    required: true,
  },
  business: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
  },
  status: {
    type: String,
  },
  bank: {
    type: String,
    required: true,
  },
});

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;
