const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    mail: {
        required: true,
        type: Number
    },
    lasConsultDate: {
        type: Date
    }
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users

/* 
Expenses from mail:
  userId,
  Amount
  business
  date
  status
  bank
  pureFromMail
  budgetCatgegory
  tag

Logic to get last consult date, ()
AutoMatch Logic

tah -> Things to globally clasify expneses

budget
  title,
  amount,
  user
  

*/