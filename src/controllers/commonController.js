const Hospital = require("../models/hospitalModel");
const Patient = require("../models/patientModel");
const {
  fetchWalletAddressesService,
  fetchPatientInfoService,
  fetchAuthorizedHospitalsService,
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

const fetchAuthorizedHospitalsController = async (req, res) => {
  // destructering data from request body
  const { patientId } = req.query;
  const patient = await Patient.findOne({ patientId });

  // handles when required data is not passed to the endpoint
  if (!patientId) {
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
  } else {
    // setting wallet addresses fetched from mongodb
    const patientWalletAddress = patient.wallet;

    // authorizing hospital
    fetchAuthorizedHospitalsService(patientWalletAddress)
      .then(async (response) => {
        if (response.status != "success") {
          console.log(response);
          res.status(404).json(response);
        } else {
          // saving addresses from the service response
          const authorizedHospitalsAddresses = response.data.authorizedHospitals;

          // mapping the addresses and fetching hospital info corresponding to each address and saving them
          const fetchedAuthorizedHospitals = await Promise.all(
            authorizedHospitalsAddresses.map(async (address) => {
              const hospital = await Hospital.findOne({
                wallet: address,
              }).lean();
              const { password, ...hospitalWithoutPassword } = hospital;
              return hospitalWithoutPassword;
            })
          );

          // adding saved hospital info to the response object
          response.data.authorizedHospitals = fetchedAuthorizedHospitals;
          res.status(200).json(response);
        }
      })
      // handling error
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

module.exports = {
  fetchSinglePatientDetails,
  fetchAllWalletAddressesController,
  fetchAuthorizedHospitalsController,
};
