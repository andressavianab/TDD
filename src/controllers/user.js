const express = require("express");
const router = express.Router();
let user = require("../models/User");
let moongose = require("mongoose");

const User = moongose.model("User", user);

router.post("/user", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Please fill in all fields!" });
    return;
  }

  try {
    const user = await User.findOne({email: email});

    if(user == undefined) {
      const newUser = new User({
        name: name,
        email: email,
        password: password,
      });
      await newUser.save();
      res.status(200).json({ email: email, message: "User created succesfully" });
      return;
    } else {
      res.status(400).json({error: "E-mail alredy registered."})
      return;
    }

  } catch (error) {
    res.sendStatus(500);
    console.log("Internal server error.");
  }
});

module.exports = router;
