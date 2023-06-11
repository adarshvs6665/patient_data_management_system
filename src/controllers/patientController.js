const Patient = require("../models/patientModel");
const PDFDocument = require("pdfkit");
const { generateMedicalReport } = require("../utils/generateMedicalReport");

const patientSignOutController = async (req, res) => {};
const patientSignInController = async (req, res) => {
  const { email, password } = req.body;
  const patient = await Patient.findOne({ email });
  if (patient) {
    if (password === patient.password) {
      res.status(200).json({
        status: "success",
        message: "Login Sucess",
        role: "patient",
        id: patient.patientId,
      });
    } else {
      res.status(400).json({ status: "failed", message: "Invalid Password" });
    }
  } else {
    res.status(400).json({ status: "failed", message: "Invalid Email" });
  }
};

const patientViewProfileController = async (req, res) => {};

const patientViewReportController = async (req, res) => {};

const patientGenerateMedicalReportController = async (req, res) => {
  const doc = new PDFDocument();
  generateMedicalReport(req.body, doc);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=medical-report.pdf");

  // Pipe the PDF document to the response
  doc.pipe(res);

  // Finalize the PDF document
  doc.end();
};

const patientViewHospitalAccessController = async (req, res) => {};

const patientViewInsuranceAccessController = async (req, res) => {};

const patientViewpatientAccessController = async (req, res) => {};

module.exports = {
  patientSignInController,
  patientSignOutController,
  patientViewProfileController,
  patientViewReportController,
  patientGenerateMedicalReportController,
  patientViewpatientAccessController,
  patientViewInsuranceAccessController,
  patientViewHospitalAccessController,
};
