const Admin = require("../models/adminModel");
const Hospital = require("../models/hospitalModel");
const Insurance = require("../models/insuranceModel");
const { v4: uuidv4 } = require("uuid");

const {
    createHospitalService,
    fetchAllHospitalsService,
    createInsuranceCompanyService,
} = require("../services/blockchain/blockchainService");

const adminSignInController = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin) {
        if (password === admin.password) {
            res.json({ message: "Login Sucess" });
        } else {
            res.json({ message: "Invalid Password" });
        }
    } else {
        res.json({ message: "Invalid Email" });
    }
};

const adminSignOutController = async (req, res) => {};

const adminCreateHospitalController = async (req, res) => {
    const {
        name,
        email,
        password,
        address,
        state,
        phone,
        wallet: hospitalWalletAddress,
        adminWalletAddress,
    } = req.body;
    try {
        if (
            !name ||
            !email ||
            !password ||
            !address ||
            !state ||
            !phone ||
            !hospitalWalletAddress ||
            !adminWalletAddress
        ) {
            const response = {
                status: "failed",
                message: "insufficient information",
            };
            res.status(400).json({
                response,
            });
        } else {
            const hospitalId = uuidv4();
            createHospitalService(
                adminWalletAddress,
                hospitalWalletAddress,
                hospitalId
            ).then(async (response) => {
                if (response.status != "success") {
                    console.log(response);
                    res.status(404).json(response);
                }
                const hospital = new Hospital({
                    hospitalId,
                    name,
                    email,
                    password,
                    address,
                    state,
                    phone,
                    wallet: hospitalWalletAddress,
                });
                const result = await hospital.save();
                const { transactionHash } = response.data;
                const { password: rmPass, ...hospitalData } = result._doc;
                const responseObj = {
                    status: "success",
                    message: "created hospital successfully",
                    data: {
                        transactionHash,
                        ...hospitalData,
                    },
                };
                res.status(200).json(responseObj);
            });
        }
    } catch (err) {
        console.log(err);
        const response = {
            status: "failed",
            message: "Internal error",
            data: {
                error: err.message,
            },
        };
        res.status(500).json({
            response,
        });
    }
};

const adminDeleteHospitalController = async (req, res) => {
    try {
        const deletedHospital = await Hospital.findByIdAndRemove(req.body.id);
        if (!deletedHospital) {
            return res.status(404).json({ error: "Hospital not found" });
        }
        res.json({ message: "Hospital deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete hospital" });
    }
};

const adminCreateInsuranceController = async (req, res) => {
    const {
        name,
        email,
        password,
        address,
        state,
        phone,
        wallet: insuranceWalletAddress,
        adminWalletAddress,
    } = req.body;
    try {
        if (
            !name ||
            !email ||
            !password ||
            !address ||
            !state ||
            !phone ||
            !insuranceWalletAddress ||
            !adminWalletAddress
        ) {
            const response = {
                status: "failed",
                message: "insufficient information",
            };
            res.status(400).json({
                response,
            });
        } else {
            const insuranceCompanyId = uuidv4();
            createInsuranceCompanyService(
                adminWalletAddress,
                insuranceWalletAddress,
                insuranceCompanyId
            ).then(async (response) => {
                if (response.status != "success") {
                    console.log(response);
                    res.status(404).json(response);
                }
                const insuranceCompany = new Insurance({
                    insuranceCompanyId,
                    name,
                    email,
                    password,
                    address,
                    state,
                    phone,
                    wallet: insuranceWalletAddress,
                });
                const result = await insuranceCompany.save();
                const { transactionHash } = response.data;
                const { password: rmPass, ...insuranceCompanyData } = result._doc;
                const responseObj = {
                    status: "success",
                    message: "created insurance company successfully",
                    data: {
                        transactionHash,
                        ...insuranceCompanyData,
                    },
                };
                res.status(200).json(responseObj);
            });
        }
    } catch (err) {
        console.log(err);
        const response = {
            status: "failed",
            message: "Internal error",
            data: {
                error: err.message,
            },
        };
        res.status(500).json({
            response,
        });
    }
};

const adminDeleteInsuranceController = async (req, res) => {
    try {
        const deletedInsurance = await Insurance.findByIdAndRemove(req.body.id);
        if (!deletedInsurance) {
            return res.status(404).json({ error: "Insurance not found" });
        }
        res.json({ message: "Insurance deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete Insurance" });
    }
};

module.exports = {
    adminSignInController,
    adminSignOutController,
    adminCreateHospitalController,
    adminDeleteHospitalController,
    adminCreateInsuranceController,
    adminDeleteInsuranceController,
};
