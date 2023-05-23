const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoConnection = require("./utils/connection");

const adminRoutes = require("./routes/adminRoutes")
const hospitalRoutes = require("./routes/hospitalRoutes")
const insuranceRoutes = require("./routes/insuranceRoutes")
const patientRoutes = require("./routes/patientRoutes")
const commonRoutes = require("./routes/commonRoutes")

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


app.use("/admin",adminRoutes);
app.use("/hospital",hospitalRoutes);
app.use("/insurance",insuranceRoutes);
app.use("/patient",patientRoutes);
app.use("/common",commonRoutes);


