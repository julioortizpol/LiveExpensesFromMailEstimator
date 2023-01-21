const mongoose = require('mongoose');
const { Schema } = mongoose;

const budgetSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
