const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");

router.get("/fetch-patient-profile", commonController.fetchPatientProfileController);
router.get(
  "/fetch-wallet-addresses",
  commonController.fetchAllWalletAddressesController
);

router.get(
  "/fetch-authorized-hospitals",
  commonController.fetchAuthorizedHospitalsController
);

router.get(
  "/fetch-authorized-insurances",
  commonController.fetchAuthorizedInsurancesController
);

router.get(
  "/fetch-patient-reports",
  commonController.fetchPatientReportsController
);


module.exports = router;
