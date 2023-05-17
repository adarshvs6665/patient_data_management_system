const express = require("express");
const router = express.Router();
const commonControllers = require("../controllers/commonController")

router.get("/view-patient-details",commonControllers.commonViewPatientDetails);


module.exports = router;