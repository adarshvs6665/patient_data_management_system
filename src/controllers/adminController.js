const Admin = require("../models/adminModel");
const Hospital = require("../models/hospitalModel");
const Insurance = require("../models/insuranceModel");

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
  const hospital = new Hospital(req.body);
  try {
    const result = await hospital.save();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
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
  const insurance = new Insurance(req.body);
  try {
    const result = await insurance.save();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json(err);
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
