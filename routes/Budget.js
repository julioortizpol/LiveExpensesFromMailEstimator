const express = require("express");
const router = express.Router();
const BudgetDBObject = require("../models/Budget");

router.get("/:userId", async (req, res) => {
  try {
    const budget = await BudgetDBObject.find({user: req.params.userId});
    res.json(budget);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
    const {
        user, 
        amount,
        title
    } = req.body
  const budget = new BudgetDBObject({
    user, 
    amount,
    title
  });
  try {
    const savePost = await budget.save();
    res.json(savePost);
  } catch (err) {
    res.json({ message: err });
  }
});


router.put("/:id", async (req, res) => {
  const {
    user, 
    amount,
    title
  } = req.body
try {
  const updateExpenses = await ExpensesDBObject.updateOne(
    { _id: req.params.id },
    {
      $set: {
        user, 
        amount,
        title
      },
    }
  );
  res.json(updateExpenses);
} catch (err) {
  res.json({ message: err });
}
});

module.exports = router;