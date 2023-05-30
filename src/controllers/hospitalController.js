const Patient = require("../models/patientModel");
const Hospital = require("../models/hospitalModel");
const { v4: uuidv4 } = require("uuid");

const {
  createPatientService,
} = require("../services/blockchain/blockchainService");

const hospitalSignInController = async (req, res) => {
  const { email, password } = req.body;
  const hospital = await Hospital.findOne({ email });
  if (hospital) {
    if (password === hospital.password) {
      res.json({ message: "Login Sucess" });
    } else {
      res.json({ message: "Invalid Password" });
    }
  } else {
    res.json({ message: "Invalid Email" });
  }
};

const hospitalSignOutController = async (req, res) => {};

const hospitalViewProfileController = async (req, res) => {};

const hospitalCreatePatientController = async (req, res) => {
  const {
    name,
    email,
    password,
    gender,
    dob,
    address,
    state,
    phone,
    wallet: patientWalletAddress,
    hospitalWalletAddress,
  } = req.body;
  try {
    if (
      !name ||
      !email ||
      !password ||
      !gender ||
      !dob ||
      !address ||
      !state ||
      !phone ||
      !patientWalletAddress ||
      !hospitalWalletAddress
    ) {
      const response = {
        status: "failed",
        message: "insufficient information",
      };
      res.status(400).json({
        response,
      });
    } else {
      const patientId = uuidv4();
      createPatientService(
        hospitalWalletAddress,
        patientWalletAddress,
        patientId
      ).then(async (response) => {
        if (response.status != "success") {
          console.log(response);
          res.status(404).json(response);
        }
        const patient = new Patient({
          patientId,
          name,
          email,
          password,
          gender,
          dob,
          address,
          state,
          phone,
          wallet: patientWalletAddress,
        });
        const result = await patient.save();
        const { transactionHash } = response.data;
        const { password: rmPass, ...patientData } = result._doc;
        const responseObj = {
          status: "success",
          message: "created patient successfully",
          data: {
            transactionHash,
            ...patientData,
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

const hospitalGeneratePatientDataController = async (req, res) => {};

const hospitalUpdatePatientDataController = async (req, res) => {};

const hospitalShareToHospitalController = async (req, res) => {};

const hospitalShareToInsuranceController = async (req, res) => {};

const hospitalViewHospitalController = async (req, res) => {};

const hospitalViewInsuranceController = async (req, res) => {};

const hospitalGeneratePolicyClaimController = async (req, res) => {};

const hospitalViewPolicyClaimController = async (req, res) => {};

module.exports = {
  hospitalSignInController,
  hospitalSignOutController,
  hospitalViewProfileController,
  hospitalCreatePatientController,
  hospitalGeneratePatientDataController,
  hospitalUpdatePatientDataController,
  hospitalShareToHospitalController,
  hospitalShareToInsuranceController,
  hospitalViewHospitalController,
  hospitalViewInsuranceController,
  hospitalGeneratePolicyClaimController,
  hospitalViewPolicyClaimController,
};
