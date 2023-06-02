const Hospital = require("../models/hospitalModel");
const Patient = require("../models/patientModel");
const Insurance = require("../models/insuranceModel");
const {
  fetchWalletAddressesService,
  fetchPatientInfoService,
  fetchAuthorizedHospitalsService,
  fetchAuthorizedInsuranceCompaniesService,
} = require("../services/blockchain/blockchainService");
const UsedAddress = require("../models/usedAddressModel");

const fetchPatientProfileController = async (req, res) => {
  const { patientId } = req.query;
  const patient = await Patient.findOne({ patientId }).lean();
  try {
    if (!patientId) {
      const response = {
        status: "failed",
        message: "please provide a patient as query parameter",
      };
      res.status(400).json(response);
    } else if (!patient) {
      const response = {
        status: "failed",
        message: "patient does not exist",
      };
      res.status(400).json(response);
    } else {
      console.log(patient);
      if (!patient.wallet) {
        const response = {
          status: "failed",
          message: "patient does not exist",
        };
        res.status(400).json(response);
      } else {
        const { password, ...patientProfileWithoutPassword } = patient;
        const response = {
          status: "success",
          message: "",
          data: {
            ...patientProfileWithoutPassword,
          },
        };
        res.status(200).json(response);
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

const fetchPatientReportsController = async (req, res) => {
  console.log(req.query);
  const {
    patientId,
    patientIdAsSender,
    insuranceCompanyIdAsSender,
    hospitalIdAsSender,
  } = req.query;
  const patient = await Patient.findOne({ patientId }).lean();
  let sender = null;

  if (patientIdAsSender) {
    sender = await Patient.findOne({ patientId: patientIdAsSender }).lean();
  } else if (insuranceCompanyIdAsSender) {
    sender = await Insurance.findOne({
      insuranceCompanyId: insuranceCompanyIdAsSender,
    }).lean();
  } else if (hospitalIdAsSender) {
    sender = await Hospital.findOne({ hospitalId: hospitalIdAsSender }).lean();
  }

  try {
    if (
      !patientId &&
      !(patientIdAsSender || insuranceCompanyIdAsSender || hospitalIdAsSender)
    ) {
      const response = {
        status: "failed",
        message: "please provide a patient as query parameter",
      };
      res.status(400).json(response);
    } else if (!patient) {
      const response = {
        status: "failed",
        message: "patient does not exist",
      };
      res.status(400).json(response);
    } else if (!sender) {
      const response = {
        status: "failed",
        message: "unknown sender",
      };
      res.status(400).json(response);
    } else {
      fetchPatientInfoService(patient.wallet, sender.wallet).then(
        async (response) => {
          if (response.status != "success") {
            res.status(404).json(response);
          } else {
            const reportsArray = response.data.patientInfo["patientData"];
            const reportsArrayNew = await Promise.all(
              reportsArray.map((report) => {
                return JSON.parse(report);
              })
            );
            response.data.patientInfo = undefined;
            response.data.reports = reportsArrayNew;
            res.status(200).json(response);
          }
        }
      );
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
  const { patientId, patientIdAsSender, hospitalIdAsSender } = req.query;
  const patient = await Patient.findOne({ patientId });
  let sender = null;
  if (patientIdAsSender) {
    sender = await Patient.findOne({ patientId: patientIdAsSender }).lean();
  } else if (hospitalIdAsSender) {
    sender = await Hospital.findOne({ hospitalId: hospitalIdAsSender }).lean();
  }

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
  } else if (!sender) {
    const response = {
      status: "failed",
      message: "unknown sender",
    };
    res.status(400).json(response);
  } else {
    // setting wallet addresses fetched from mongodb
    const patientWalletAddress = patient.wallet;

    // authorizing hospital
    fetchAuthorizedHospitalsService(patientWalletAddress, sender.wallet)
      .then(async (response) => {
        if (response.status != "success") {
          console.log(response);
          res.status(404).json(response);
        } else {
          // saving addresses from the service response
          const authorizedHospitalsAddresses =
            response.data.authorizedHospitals;

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

const fetchAuthorizedInsurancesController = async (req, res) => {
  // destructering data from request body
  const { patientId, patientIdAsSender, hospitalIdAsSender } = req.query;
  const patient = await Patient.findOne({ patientId });

  let sender = null;
  if (patientIdAsSender) {
    sender = await Patient.findOne({ patientId: patientIdAsSender }).lean();
  } else if (hospitalIdAsSender) {
    sender = await Hospital.findOne({ hospitalId: hospitalIdAsSender }).lean();
  }

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
  } else if (!sender) {
    const response = {
      status: "failed",
      message: "unknown sender",
    };
    res.status(400).json(response);
  } else {
    // setting wallet addresses fetched from mongodb
    const patientWalletAddress = patient.wallet;

    // authorizing hospital
    fetchAuthorizedInsuranceCompaniesService(
      patientWalletAddress,
      sender.wallet
    )
      .then(async (response) => {
        if (response.status != "success") {
          console.log(response);
          res.status(404).json(response);
        } else {
          // saving addresses from the service response
          console.log(response);
          const authorizedInsurancesAddresses =
            response.data.authorizedInsuranceCompanies;

          // mapping the addresses and fetching hospital info corresponding to each address and saving them
          const fetchedAuthorizedInsurances = await Promise.all(
            authorizedInsurancesAddresses.map(async (address) => {
              const insurance = await Insurance.findOne({
                wallet: address,
              }).lean();
              const { password, ...insuranceWithoutPassword } = insurance;
              return insuranceWithoutPassword;
            })
          );

          // adding saved hospital info to the response object
          response.data.authorizedInsuranceCompanies =
            fetchedAuthorizedInsurances;
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

const fetchUnusedAddressesController = async (req, res) => {
  
  try {
    fetchWalletAddressesService().then(async (response) => {
      if (response.status == "success") {
        const addresses = response.data.addresses;
        const unusedAddresses = await Promise.all(
          addresses.map(async (address) => {
            const addressInDB = await UsedAddress.findOne({ address });
            if (!addressInDB) return address;
            else return null;
          })
        );

        // removing null values
        const filteredAddresses = unusedAddresses.filter(
          (address) => address !== null
        );
        // setting filtered address as response
        response.data.addresses = filteredAddresses;
        res.status(200).json(response);
      } else {
        res.status(404).json(response);
      }
    });
  } catch (error) {
    // handling errors
    const response = {
      status: "failed",
      message: error.message,
    };
    res.status(500).json(response);
  }
};

module.exports = {
  fetchPatientProfileController,
  fetchAllWalletAddressesController,
  fetchAuthorizedHospitalsController,
  fetchAuthorizedInsurancesController,
  fetchPatientReportsController,
  fetchUnusedAddressesController,
};
