const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const routes = require('./routes/routes');

app.use('/api', routes)


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