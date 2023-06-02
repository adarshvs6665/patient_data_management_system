const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");

router.get("/view-patient-details", commonController.fetchSinglePatientDetails);
router.get(
  "/fetch-wallet-addresses",
  commonController.fetchAllWalletAddressesController
);

router.get(
  "/fetch-authorized-hospitals",
  commonController.fetchAuthorizedHospitalsController
);


module.exports = router;
