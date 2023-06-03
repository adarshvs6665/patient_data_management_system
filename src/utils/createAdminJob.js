const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoConnection = require("./connection");
const { v4: uuidv4 } = require("uuid");
const Admin = require("../models/adminModel");
const {
    fetchAdminAddressService,
} = require("../services/blockchain/blockchainService");
const UsedAddress = require("../models/usedAddressModel");

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
                adminId: uuidv4(),
                email: "admin@dapp.com",
                password: "admin123#",
                wallet: adminWalletAddress,
            });
            const usedAddr = new UsedAddress({address : adminWalletAddress})
            usedAddr.save();
            const result = await admin.save();
            console.log("Admin Created Successfully");
        });
    } catch (err) {
        console.log(err);
    }
};

createAdmin();
