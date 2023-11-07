const express = require("express");
const app = express();
let mongoose = require("mongoose");
require('dotenv').config()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const userController = require('./controllers/user');
app.use('/', userController);

async function connectDb() {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
    console.log("database connected successfully")
}

connectDb().catch(err => console.log(err));

app.get("/", (req, res) => {
  res.json({});
});

module.exports = app;