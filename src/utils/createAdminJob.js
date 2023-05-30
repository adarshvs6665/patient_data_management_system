const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoConnection = require("./connection");
const Admin = require("../models/adminModel");
const {
    fetchAdminAddressService,
} = require("../services/blockchain/blockchainService");

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
    try {
        fetchAdminAddressService().then(async (response) => {
            if (response.status != "success") {
              console.log(response);
              return;
            };
            const adminWalletAddress = response.data.adminAddress;
            const admin = new Admin({
                email: "admin@dapp.com",
                password: "admin123#",
                wallet: adminWalletAddress,
            });
            const result = await admin.save();
            console.log("Admin Created Successfully");
        });
    } catch (err) {
        console.log(err);
    }
};

createAdmin();
