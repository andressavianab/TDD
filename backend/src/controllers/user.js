const express = require("express");
const router = express.Router();
let user = require("../models/User");
let mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = mongoose.model("User", user);

router.post("/user", async (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Please fill in all fields!" });
    return;
  }

  try {
    const user = await User.findOne({ email: email });

    if (user == undefined) {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        const newUser = new User({
          name: name,
          email: email,
          password: hash,
        });
        await newUser.save();
        res
          .status(200)
          .json({ email: email, message: "User created succesfully." });
        return;
      });
    } else {
      res.status(400).json({ error: "E-mail alredy registered." });
      return;
    }
  } catch (error) {
    res.sendStatus(500);
    console.log("Internal server error.");
  }
});

router.delete("/user/:name", async (req, res) => {
  const name = req.params.name;
  console.log(name);
  if (name != undefined) {
    await User.deleteOne({ name: name });
    res.status(200).json({ message: "Deleted" });
    return;
  } else {
    res.status(404).json({ error: "User undefined" });
    return;
  }
});

module.exports = router;
