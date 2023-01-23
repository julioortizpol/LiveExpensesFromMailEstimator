const express = require("express");
const router = express.Router();
const UsersDBObject = require("../models/Users");

router.get("/", async (req, res) => {
  try {
    const users = await UsersDBObject.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
    const {
        name, 
        mail,
        lasConsultDate
    } = req.body
  const user = new UsersDBObject({
    name, 
    mail,
    lasConsultDate
  });
  try {
    const savePost = await user.save();
    res.json(savePost);
  } catch (err) {
    res.json({ message: err });
  }
});


module.exports = router;