const express = require("express");
const router = express.Router();
const patientController = require('../controllers/patientController')

router.post("/sign-in", patientController.patientSignInController);

router.get("/sign-out", patientController.patientSignOutController);

router.get("/view-profile", patientController.patientViewProfileController);

router.get("/view-report", patientController.patientViewReportController);

router.put("/share-report", patientController.patientShareReportController);

router.get("/view-hospital-access", patientController.patientViewHospitalAccessController);

router.get("/view-insurance-access", patientController.patientViewInsuranceAccessController);

module.exports = router;
