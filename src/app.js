const express = require("express");
const app = express();
let mongoose = require("mongoose");
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const userController = require("./controllers/user");
app.use("/", userController);

async function connectDb() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
  console.log("database connected successfully");
}

connectDb().catch((err) => console.log(err));

let jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const user = require("./models/User");
const User = mongoose.model("User", user);
const bcrypt = require("bcrypt");

app.post("/auth", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Please fill in all fields!" });
    return;
  }

  const user = await User.findOne({ email: email });

  if (user == undefined) {
    res.status(403).json({ errors: { email: "Unregistered user." } });
    return;
  }

  const isPasswordRight = await bcrypt.compare(password, user.password);

  if (!isPasswordRight) {
    res.status(403).json({ errors: { password: "Incorrect password." } });
    return;
  }

  jwt.sign(
    { email: email, name: user.name, id: user._id },
    jwtSecret,
    { expiresIn: "48h" },
    (err, token) => {
      if (err) {
        res.status(500);
        console.log(err);
        return;
      } else {
        res.json({ user: { id: user._id, email: user.email }, token: token });
        return;
      }
    }
  );
});

app.get("/", (req, res) => {
  res.json({});
});

module.exports = app;