const express = require("express");
const router = express.Router();
const ExpensesDBObject = require("../models/Expenses");

router.get("/:userId", async (req, res) => {
  try {
    const expenses = await ExpensesDBObject.find({user: req.params.userId});
    res.json(expenses);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
    const {
        user, 
        budgetCategory, 
        amount,
        business,
        status,
        bank
    } = req.body
  const expenses = new ExpensesDBObject({
    user,
    budgetCategory,
    amount,
    business,
    status,
    bank,
    pureFromMail: true
  });
  try {
    const savePost = await expenses.save();
    res.json(savePost);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/addToCategory/:id", async (req, res) => {
    const {
        budgetCategory,
    } = req.body
  try {
    const updateExpenses = await ExpensesDBObject.updateOne(
      { _id: req.params.id },
      {
        $set: {
            budgetCategory,
        },
      }
    );
    res.json(updateExpenses);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;