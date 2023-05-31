const Patient = require("../models/patientModel");
const Hospital = require("../models/hospitalModel");
const { v4: uuidv4 } = require("uuid");

const {
  createPatientService,
  updatePatientReportService,
  addAuthorizedHospitalService,
} = require("../services/blockchain/blockchainService");

const hospitalSignInController = async (req, res) => {
  const { email, password } = req.body;
  const hospital = await Hospital.findOne({ email });
  if (hospital) {
    if (password === hospital.password) {
      res.json({ message: "Login Sucess" });
    } else {
      res.json({ message: "Invalid Password" });
    }
  } else {
    res.json({ message: "Invalid Email" });
  }
};

const hospitalSignOutController = async (req, res) => {};

const hospitalViewProfileController = async (req, res) => {
  const { hospitalId } = req.query;
  const hospital = await Hospital.findOne({ hospitalId }).lean();

  if (!hospitalId) {
    const response = {
      status: "failed",
      message: "insufficient information",
    };
    res.status(400).json({
      response,
    });
  }
  // handles when hospital does not exist
  else if (!hospital) {
    const response = {
      status: "failed",
      message: "hospital does not exist",
    };
    res.status(404).json({
      response,
    });
  } else {
    // removing password from mongodb response
    const { password: rmPass, ...hospitalData } = hospital;
    const response = {
      status: "success",
      message: "fetched hospital information successfully",
      data: {
        ...hospitalData,
      },
    };
    res.status(200).json({
      response,
    });
  }
};

const hospitalCreatePatientController = async (req, res) => {
  // destructering data from request body
  const {
    name,
    email,
    password,
    gender,
    dob,
    address,
    state,
    phone,
    hospitalId,
    wallet: patientWalletAddress,
  } = req.body;

  const hospital = await Hospital.findOne({ hospitalId });
  // handles when required data is not passed to the endpoint
  if (
    !name ||
    !email ||
    !password ||
    !gender ||
    !dob ||
    !address ||
    !state ||
    !phone ||
    !hospitalId ||
    !patientWalletAddress
  ) {
    const response = {
      status: "failed",
      message: "insufficient information",
    };
    res.status(400).json({
      response,
    });
  }
  // handles when hospital does not exist
  else if (!hospital) {
    const response = {
      status: "failed",
      message: "hospital does not exist",
    };
    res.status(404).json({
      response,
    });
  } else {
    const patientId = uuidv4();
    const hospitalWalletAddress = hospital.wallet;
    createPatientService(hospitalWalletAddress, patientWalletAddress, patientId)
      .then(async (response) => {
        if (response.status != "success") {
          console.log(response);
          res.status(404).json(response);
        }
        const patient = new Patient({
          patientId,
          name,
          email,
          password,
          gender,
          dob,
          address,
          state,
          phone,
          wallet: patientWalletAddress,
        });
        const result = await patient.save();
        const { transactionHash } = response.data;

        // removing password from mongodb response
        const { password: rmPass, ...patientData } = result._doc;
        const responseObj = {
          status: "success",
          message: "created patient successfully",
          data: {
            transactionHash,
            ...patientData,
          },
        };
        res.status(200).json(responseObj);
      })
      .catch((err) => {
        console.log(err);
        const response = {
          status: "failed",
          message: "Internal error",
          data: {
            error: err.message,
          },
        };
        res.status(500).json({
          response,
        });
      });
  }
};

const hospitalUpdatePatientMedicalReportController = async (req, res) => {
  // destructering data from request body
  const { hospitalId, patientId, patientReport } = req.body;
  const patient = await Patient.findOne({ patientId });
  const hospital = await Hospital.findOne({ hospitalId });
  // handles when required data is not passed to the endpoint
  if (!patientId || !hospitalId || !patientReport) {
    const response = {
      status: "failed",
      message: "insufficient information",
    };
    res.status(400).json({
      response,
    });
  }
  // handles when patient does not exist
  else if (!patient) {
    const response = {
      status: "failed",
      message: "patient does not exist",
    };
    res.status(404).json({
      response,
    });
  }
  // handles when hospital does not exist
  else if (!hospital) {
    const response = {
      status: "failed",
      message: "hospital does not exist",
    };
    res.status(404).json({
      response,
    });
  } else {
    const hospitalWalletAddress = hospital.wallet;
    const patientWalletAddress = patient.wallet;
    patientReport.hospitalId = hospitalId;
    patientReport.reportId = uuidv4();

    updatePatientReportService(
      hospitalWalletAddress,
      patientWalletAddress,
      patientReport
    )
      .then(async (response) => {
        if (response.status != "success") {
          console.log(response);
          res.status(404).json(response);
        } else {
          res.status(200).json(response);
        }
      })
      .catch((err) => {
        console.log(err);
        const response = {
          status: "failed",
          message: "Internal error",
          data: {
            error: err.message,
          },
        };
        res.status(500).json({
          response,
        });
      });
  }
};

const authorizeHospitalController = async (req, res) => {
  // destructering data from request body
  const { hospitalId, patientId, hospitalToBeAuthorizedId } = req.body;
  const patient = await Patient.findOne({ patientId });
  const hospital = await Hospital.findOne({ hospitalId });
  const hospitalToBeAuthorized = await Hospital.findOne({
    hospitalId: hospitalToBeAuthorizedId,
  });

  // handles when required data is not passed to the endpoint
  if (!patientId || !hospitalId || !hospitalToBeAuthorizedId) {
    const response = {
      status: "failed",
      message: "insufficient information",
    };
    res.status(400).json({
      response,
    });
  }
  // handles when patient does not exist
  else if (!patient) {
    const response = {
      status: "failed",
      message: "patient does not exist",
    };
    res.status(404).json({
      response,
    });
  }
  // handles when hospital does not exist
  else if (!hospital) {
    const response = {
      status: "failed",
      message: "hospital does not exist",
    };
    res.status(404).json({
      response,
    });
  }
  // handles when hospital to be authorized does not exist
  else if (!hospitalToBeAuthorized) {
    const response = {
      status: "failed",
      message: "cannot authorize hospital which does not exist",
    };
    res.status(404).json({
      response,
    });
  } else {
    // setting wallet addresses fetched from mongodb
    const patientWalletAddress = patient.wallet;
    const hospitalWalletAddress = hospital.wallet;
    const hospitalAddressToBeAuthorized = hospitalToBeAuthorized.wallet;

    // authorizing hospital
    addAuthorizedHospitalService(
      hospitalWalletAddress,
      patientWalletAddress,
      hospitalAddressToBeAuthorized
    )
      .then((response) => {
        if (response.status != "success") {
          console.log(response);
          res.status(404).json(response);
        } else {
          res.status(200).json(response);
        }
      })
      .catch((err) => {
        console.log(err);
        const response = {
          status: "failed",
          message: "Internal error",
          data: {
            error: err.message,
          },
        };
        res.status(500).json({
          response,
        });
      });
  }
};

const hospitalShareToInsuranceController = async (req, res) => {};

const hospitalViewHospitalController = async (req, res) => {};

const hospitalViewInsuranceController = async (req, res) => {};

const hospitalGeneratePolicyClaimController = async (req, res) => {};

const hospitalViewPolicyClaimController = async (req, res) => {};

module.exports = {
  hospitalSignInController,
  hospitalSignOutController,
  hospitalViewProfileController,
  hospitalCreatePatientController,
  hospitalUpdatePatientMedicalReportController,
  authorizeHospitalController,
  hospitalShareToInsuranceController,
  hospitalViewHospitalController,
  hospitalViewInsuranceController,
  hospitalGeneratePolicyClaimController,
  hospitalViewPolicyClaimController,
};
