const Admin = require("../models/adminModel");
const Hospital = require("../models/hospitalModel");
const Insurance = require("../models/insuranceModel");
const { v4: uuidv4 } = require("uuid");

const {
  createHospitalService,
  fetchAllHospitalsService,
  createInsuranceCompanyService,
} = require("../services/blockchain/blockchainService");
const UsedAddress = require("../models/usedAddressModel");

const adminSignInController = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin) {
    if (password === admin.password) {
      res.status(200).json({
        status: "success",
        message: "Login Sucess",
        role: "admin",
        id: admin.adminId,
      });
    } else {
      res.status(400).json({ status: "failed", message: "Invalid Password" });
    }
  } else {
    res.status(400).json({ status: "failed", message: "Invalid Email" });
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
    adminId,
  } = req.body;
  const admin = await Admin.findOne({ adminId });
  const hospital = await Hospital.findOne({ email });
  if (
    !name ||
    !email ||
    !password ||
    !address ||
    !state ||
    !phone ||
    !hospitalWalletAddress ||
    !adminId
  ) {
    const response = {
      status: "failed",
      message: "insufficient information",
    };
    res.status(400).json({
      response,
    });
  } else if (!admin) {
    const response = {
      status: "failed",
      message: "admin with the id does not exist",
    };
    res.status(409).json({
      response,
    });
  } else if (hospital) {
    const response = {
      status: "failed",
      message: "hospital email already in use",
    };
    res.status(409).json({
      response,
    });
  } else {
    const hospitalId = uuidv4();
    const adminWalletAddress = admin.wallet;
    createHospitalService(adminWalletAddress, hospitalWalletAddress, hospitalId)
      .then(async (response) => {
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

        const usedAddress = new UsedAddress({address: hospitalWalletAddress})
        await usedAddress.save();
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
      })
      .catch((err) => {
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
    adminId,
  } = req.body;

  const admin = await Admin.findOne({ adminId });
  const insurance = await Insurance.findOne({ email });
  if (
    !name ||
    !email ||
    !password ||
    !address ||
    !state ||
    !phone ||
    !insuranceWalletAddress ||
    !adminId
  ) {
    const response = {
      status: "failed",
      message: "insufficient information",
    };
    res.status(400).json({
      response,
    });
  } else if (!admin) {
    const response = {
      status: "failed",
      message: "admin with the id does not exist",
    };
    res.status(409).json({
      response,
    });
  } else if (insurance) {
    const response = {
      status: "failed",
      message: "insurance company email already in use",
    };
    res.status(409).json({
      response,
    });
  } else {
    const insuranceCompanyId = uuidv4();
    const adminWalletAddress = admin.wallet;
    createInsuranceCompanyService(
      adminWalletAddress,
      insuranceWalletAddress,
      insuranceCompanyId
    )
      .then(async (response) => {
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

        const usedAddress = new UsedAddress({address: insuranceWalletAddress})
        await usedAddress.save();

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
      })
      .catch((err) => {
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
