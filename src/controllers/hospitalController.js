const Patient = require("../models/patientModel");
const Hospital = require("../models/hospitalModel")

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
