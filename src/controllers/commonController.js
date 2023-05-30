const Patient = require("../models/patientModel");
const {
  fetchWalletAddressesService,
  fetchPatientInfoService,
} = require("../services/blockchain/blockchainService");

const fetchSinglePatientDetails = async (req, res) => {
  const { patientId } = req.query;
  try {
    if (!patientId) {
      const response = {
        status: "failed",
        message: "please provide a patient as query parameter",
      };
      res.status(400).json(response);
    } else {
      const patient = await Patient.findOne({ patientId });
      console.log(patient);
      if (!patient.wallet) {
        const response = {
          status: "failed",
          message: "please does not exist",
        };
        res.status(400).json(response);
      } else {
        fetchPatientInfoService(patient.wallet).then((response) => {
          if (response.status != "success") {
            console.log(response);
            res.status(404).json(response);
          }
          res.status(200).json(response);
        });
      }
    }
  } catch (error) {
    console.log(error);
    const response = {
      status: "failed",
      message: "Internal Server Error",
    };
    res.status(500).json(response);
  }
};

const fetchAllWalletAddressesController = async (req, res) => {
  try {
    fetchWalletAddressesService().then((response) => {
      if (response.status == "success") {
        res.status(200).json(response);
      } else {
        res.status(404).json(response);
      }
    });
  } catch (error) {
    const response = {
      status: "failed",
      message: error.message,
    };
    res.status(500).json(response);
  }
};

module.exports = {
  fetchSinglePatientDetails,
  fetchAllWalletAddressesController,
};
