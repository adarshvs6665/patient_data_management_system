const patientSignInController = async (req, res) => {};
const Patient = require("../models/patientModel")

const patientSignOutController = async (req, res) => {};
const patientSignInController = async (req, res) => {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (patient) {
      if (password === patient.password) {
        res.status(200).json({ status:"success", message: "Login Sucess" ,role:"patient", id:patient.id});
      } else {
        res.status(400).json({status:"failed", message: "Invalid Password" });
      }
    } else {
      res.status(400).json({status:"failed", message: "Invalid Email" });
    }
};

const patientViewProfileController = async (req, res) => {};

const patientViewReportController = async (req, res) => {};

const patientShareReportController = async (req, res) => {};

const patientViewHospitalAccessController = async (req, res) => {};

const patientViewInsuranceAccessController = async (req, res) => {};

module.exports = {
  patientSignInController,
  patientSignOutController,
  patientViewProfileController,
  patientViewReportController,
  patientShareReportController,
  patientViewHospitalAccessController,
  patientViewInsuranceAccessController,
};

}

const patientShareReportController = async(req,res)=>{

}

const patientViewpatientAccessController = async(req,res)=>{

}

const patientViewInsuranceAccessController = async(req,res)=>{

}

const patientViewHospitalAccessController = async(req,res)=>{

}




module.exports ={
patientSignInController,
patientSignOutController,
patientViewProfileController,
patientViewReportController,
patientShareReportController,
patientViewpatientAccessController,
patientViewInsuranceAccessController,
patientViewHospitalAccessController
}