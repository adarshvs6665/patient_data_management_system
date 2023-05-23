const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoConnection = require("./connection");
const Admin = require("../models/adminModel");

dotenv.config();
const app = express();

//mongo link
const mdbcnt = "mongodb://localhost:27017/patient_db";
//mongoConnection
mongoConnection(mdbcnt, app);
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const createAdmin = async () => {
  const admin = new Admin({ email: "admin@dapp.com", password: "admin123#" });
  try {
    const result = await admin.save();
    console.log("Admin Created Successfully");
  } catch (err) {
    console.log(err);
  }
};

createAdmin();