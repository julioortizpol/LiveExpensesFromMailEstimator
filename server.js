const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var cors = require('cors')

const app = express();

const usersRoutes = require('./routes/Users');
const expensesRoutes = require('./routes/Expenses');
const budgetRoutes = require('./routes/Budget');

app.use(cors())
app.use(express.json());
app.use('/api/users', usersRoutes)
app.use('/api/expenses', expensesRoutes)
app.use('/api/budget', budgetRoutes)

const uri = process.env.DATABASE_URL
mongoose.connect(uri);
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})


app.use(express.json());

app.listen(8000, () => {
    console.log(`Server Started at ${8000}`)
})