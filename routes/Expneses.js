const express = require("express");
const router = express.Router();
const ExpensesDBObject = require("../models/Expenses");

router.get("/", async (req, res) => {
  try {
    const expenses = await ExpensesDBObject.find();
    res.json(almacenes);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const expenses = new ExpensesDBObject({
    descripcion: req.body.descripcion,
    estado: true,
  });
  try {
    const savePost = await alamacen.save();
    res.json(savePost);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateExpenses = await ExpensesDBObject.updateOne(
      { _id: req.params.id },
      {
        $set: {
          descripcion: req.body.descripcion,
          estado: req.body.estado,
        },
      }
    );
    res.json(updateAlmacen);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;