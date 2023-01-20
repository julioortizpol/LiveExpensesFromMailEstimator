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
    ref: 'Users',
    required: true,
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
  status: {
    type: String,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
});

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;

/*

Logic to get last consult date, ()
AutoMatch Logic

budget
  title,
  amount,
  user
  

*/
