const express = require("express");
const router = express.Router();
const insuranceController = require("../controllers/insuranceController");

router.post("/sign-in", insuranceController.insuranceSignInController);

router.get("/sign-out", insuranceController.insuranceSignOutController);

router.get(
  "/fetch-profile",
  insuranceController.fetchInsuranceCompanyProfileController
);

router.get(
  "/view-policy-claims",
  insuranceController.insuranceViewPolicyClaimsController
);

router.get(
  "/view-data-attached-to-policy-claims",
  insuranceController.insuranceViewPolicyClaimsDataController
);

router.post("/accept-claim", insuranceController.insuranceAcceptController);

router.post("/reject-claim", insuranceController.insuranceRejectController);

router.get(
  "/view-policy-history",
  insuranceController.insuranceViewPolicyController
);

module.exports = router;
