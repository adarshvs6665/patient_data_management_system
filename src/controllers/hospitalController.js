const Patient = require("../models/patientModel");
const Hospital = require("../models/hospitalModel");
const { v4: uuidv4 } = require("uuid");

const {
  createPatientService,
  updatePatientReportService,
  addAuthorizedHospitalService,
  addAuthorizedInsuranceCompanyService,
  fetchAuthorizedHospitalsService,
  fetchAuthorizedInsuranceCompaniesService,
  fetchAllPatientsService,
} = require("../services/blockchain/blockchainService");
const Insurance = require("../models/insuranceModel");
const UsedAddress = require("../models/usedAddressModel");

const hospitalSignInController = async (req, res) => {
  const { email, password } = req.body;
  const hospital = await Hospital.findOne({ email });
  if (hospital) {
    if (password === hospital.password) {
      res.status(200).json({
        status: "success",
        message: "Login Sucess",
        role: "hospital",
        id: hospital.hospitalId,
      });
    } else {
      res.json({ message: "Invalid Password" });
    }
  } else {
    res.json({ message: "Invalid Email" });
  }
};

const hospitalSignOutController = async (req, res) => {};

const fetchHospitalProfileController = async (req, res) => {
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

        const usedAddress = new UsedAddress({ address: patientWalletAddress });
        await usedAddress.save();

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
  if (
    !patientId ||
    !hospitalId ||
    !patientReport ||
    !patientReport.dateOfVisit ||
    !patientReport.causeOfVisit ||
    !patientReport.condition ||
    !patientReport.description ||
    !patientReport.doctor ||
    !patientReport.medication
  ) {
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
    patientReport.hospitalName = hospital.name;

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

const authorizeInsuranceCompanyController = async (req, res) => {
  // destructering data from request body
  const { hospitalId, patientId, insuranceCompanyToBeAuthorizedId } = req.body;
  const patient = await Patient.findOne({ patientId });
  const hospital = await Hospital.findOne({ hospitalId });
  const insuranceCompanyToBeAuthorized = await Insurance.findOne({
    insuranceCompanyId: insuranceCompanyToBeAuthorizedId,
  });

  // handles when required data is not passed to the endpoint
  if (!patientId || !hospitalId || !insuranceCompanyToBeAuthorizedId) {
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
  // handles when insurance company to be authorized does not exist
  else if (!insuranceCompanyToBeAuthorized) {
    const response = {
      status: "failed",
      message: "cannot authorize insurance company which does not exist",
    };
    res.status(404).json({
      response,
    });
  } else {
    // setting wallet addresses fetched from mongodb
    const patientWalletAddress = patient.wallet;
    const hospitalWalletAddress = hospital.wallet;
    const insuranceCompanyAddressToBeAuthorized =
      insuranceCompanyToBeAuthorized.wallet;

    // authorizing hospital
    addAuthorizedInsuranceCompanyService(
      hospitalWalletAddress,
      patientWalletAddress,
      insuranceCompanyAddressToBeAuthorized
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

const fetchUnAuthorizedHospitalsController = async (req, res) => {
  const { patientId, hospitalId } = req.query;
  const patient = await Patient.findOne({ patientId }).lean();
  const hospital = await Hospital.findOne({ hospitalId }).lean();
  try {
    if (!patientId || !hospitalId) {
      const response = {
        status: "failed",
        message: "insufficient information",
      };
      res.status(400).json(response);
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
    } else if (!hospital) {
      const response = {
        status: "failed",
        message: "unknown sender",
      };
      res.status(400).json(response);
    } else {
      fetchAuthorizedHospitalsService(patient.wallet, hospital.wallet).then(
        async (response) => {
          if (response.status != "success") {
            res.status(404).json(response);
          } else {
            const authorizedHospitalsArray = response.data.authorizedHospitals;
            const hospitals = await Hospital.find({}, { password: 0 });
            const unauthorizedHospitals = hospitals.filter(
              (hospital) => !authorizedHospitalsArray.includes(hospital.wallet)
            );
            response.data.authorizedHospitals = undefined;
            response.data.unauthorizedHospitals = unauthorizedHospitals;
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

const fetchUnAuthorizedInsurancesController = async (req, res) => {
  const { patientId, hospitalId } = req.query;
  const patient = await Patient.findOne({ patientId }).lean();
  const hospital = await Hospital.findOne({ hospitalId }).lean();
  try {
    if (!patientId || !hospitalId) {
      const response = {
        status: "failed",
        message: "insufficient information",
      };
      res.status(400).json(response);
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
    } else if (!hospital) {
      const response = {
        status: "failed",
        message: "unknown sender",
      };
      res.status(400).json(response);
    } else {
      fetchAuthorizedInsuranceCompaniesService(
        patient.wallet,
        hospital.wallet
      ).then(async (response) => {
        if (response.status != "success") {
          res.status(404).json(response);
        } else {
          const authorizedInsuranceCompaniesArray =
            response.data.authorizedInsuranceCompanies;
          const insuranceCompanies = await Insurance.find({}, { password: 0 });
          const unAuthorizedInsuranceCompanies = insuranceCompanies.filter(
            (insurance) =>
              !authorizedInsuranceCompaniesArray.includes(insurance.wallet)
          );
          response.data.authorizedInsuranceCompanies = undefined;
          response.data.unAuthorizedInsuranceCompanies =
            unAuthorizedInsuranceCompanies;
          res.status(200).json(response);
        }
      });
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

const fetchAuthorizedPatientsController = async (req, res) => {
  const { hospitalId } = req.query;
  const hospital = await Hospital.findOne({ hospitalId }).lean();
  try {
    // handles when required data is not passed to the endpoint
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
      fetchAllPatientsService(hospital.wallet)
        .then(async (response) => {
          // console.log(response.data.patients[0]['authorizedHospitals']);
          const patientsArray = response.data.patients;
          console.log(response);
          const patientIdsArray = await Promise.all(
            patientsArray.map((patient) => {
              if (patient["authorizedHospitals"].includes(hospital.wallet))
                return patient["patientId"];
              else return null;
            })
          );

          // removing null values
          const filteredPatientIdsArray = patientIdsArray.filter(
            (id) => id !== null
          );

          const patientDetailsArray = await Promise.all(
            filteredPatientIdsArray.map(async (id) => {
              const patient = await Patient.findOne({ patientId: id });
              return patient;
            })
          );

          const filteredPatientDetailsArray = patientDetailsArray.filter(
            (patient) => patient !== null
          );

          response.data.patients = undefined;
          response.data.patients = filteredPatientDetailsArray;
          res.send(response);
        })
        .catch((err) => {
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
  } catch (error) {}
};

module.exports = {
  hospitalSignInController,
  hospitalSignOutController,
  fetchHospitalProfileController,
  hospitalCreatePatientController,
  hospitalUpdatePatientMedicalReportController,
  authorizeHospitalController,
  authorizeInsuranceCompanyController,
  fetchUnAuthorizedHospitalsController,
  fetchUnAuthorizedInsurancesController,
  fetchAuthorizedPatientsController,
};
