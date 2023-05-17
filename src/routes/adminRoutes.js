const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/adminController");

router.post("/sign-in", adminControllers.adminSignInController);

router.post("/sign-out", adminControllers.adminSignOutController);

router.post("/create-hospital", adminControllers.adminCreateHospitalController);

router.post("/delete-hospital", adminControllers.adminDeleteHospitalController);

router.post("/create-insurance-company", adminControllers.adminCreateInsuranceController);

router.post("/delete-insurance-company", adminControllers.adminDeleteInsuranceController);

module.exports = router;
