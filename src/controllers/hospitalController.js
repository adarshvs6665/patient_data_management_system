const Patient = require("../models/patientModel");
const Hospital = require("../models/hospitalModel");

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
  const patient = new Patient(req.body);
  try {
    const result = await patient.save();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
  }

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
