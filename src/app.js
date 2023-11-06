const express = require("express");
const app = express();
let mongoose = require("mongoose");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

async function connectDb() {
    await mongoose.connect('mongodb://127.0.0.1:27017/guidepics');
    console.log("databse connected successfully")
}

connectDb().catch(err => console.log(err));

app.get("/", (req, res) => {
  res.json({});
});

module.exports = app;