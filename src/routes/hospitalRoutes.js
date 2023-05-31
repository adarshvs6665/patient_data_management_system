const express = require("express");
const router = express.Router();
const hospitalController = require("../controllers/hospitalController");

router.post("/sign-in", hospitalController.hospitalSignInController);

router.get("/sign-out", hospitalController.hospitalSignOutController);

router.get("/view-profile", hospitalController.hospitalViewProfileController);

router.post(
  "/create-patient",
  hospitalController.hospitalCreatePatientController
);

router.put(
  "/update-patient-report",
  hospitalController.hospitalUpdatePatientMedicalReportController
);

router.put(
  "/authorize-hospital",
  hospitalController.authorizeHospitalController
);

router.put(
  "/authorize-insurance-company",
  hospitalController.authorizeInsuranceCompanyController
);

router.get(
  "/view-auth-hospital-list",
  hospitalController.hospitalViewHospitalController
);

router.get(
  "/view-auth-insurance-list",
  hospitalController.hospitalViewInsuranceController
);

router.get(
  "/generate-policy-claim",
  hospitalController.hospitalGeneratePolicyClaimController
);

router.get(
  "/view-policy-claim",
  hospitalController.hospitalViewPolicyClaimController
);

module.exports = router;
