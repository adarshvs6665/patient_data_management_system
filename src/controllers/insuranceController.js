const Hospital = require("../models/hospitalModel");
const Insurance = require("../models/insuranceModel");
const Patient = require("../models/patientModel");
const {
  fetchAllPatientsService
} = require("../services/blockchain/blockchainService");

const insuranceSignInController = async (req, res) => {
  const { email, password } = req.body;
  const insurance = await Insurance.findOne({ email });
  if (insurance) {
    if (password === insurance.password) {
      res.status(200).json({
        status: "success",
        message: "Login Sucess",
        role: "insurance",
        id: insurance.insuranceCompanyId,
      });
    } else {
      res.json({ message: "Invalid Password" });
    }
  } else {
    res.json({ message: "Invalid Email" });
  }
};

const insuranceSignOutController = async (req, res) => {};

const fetchInsuranceCompanyProfileController = async (req, res) => {
  const { insuranceCompanyId } = req.query;
  const insuranceCompany = await Insurance.findOne({ insuranceCompanyId }).lean();

  if (!insuranceCompanyId) {
    const response = {
      status: "failed",
      message: "insufficient information",
    };
    res.status(400).json({
      response,
    });
  }
  // handles when hospital does not exist
  else if (!insuranceCompany) {
    const response = {
      status: "failed",
      message: "insurance company does not exist",
    };
    res.status(404).json({
      response,
    });
  } else {
    // removing password from mongodb response
    const { password: rmPass, ...insuranceCompanyData } = insuranceCompany;
    const response = {
      status: "success",
      message: "fetched insurance company information successfully",
      data: {
        ...insuranceCompanyData,
      },
    };
    res.status(200).json({
      response,
    });
  }
};

const insuranceViewPolicyClaimsController = async (req, res) => {};

const insuranceViewPolicyClaimsDataController = async (req, res) => {};

const viewPolicyClaimsDataController = async (req, res) => {};

const insuranceRejectController = async (req, res) => {};

const insuranceAcceptController = async (req, res) => {};

const insuranceViewPolicyController = async (req, res) => {};

const fetchAuthorizedPatientsController = async (req, res) => {
  const { insuranceCompanyId } = req.query;
  console.log(req.query);
  const insurance = await Insurance.findOne({ insuranceCompanyId }).lean();
  try {
    // handles when required data is not passed to the endpoint
    if (!insuranceCompanyId) {
      const response = {
        status: "failed",
        message: "insufficient information",
      };
      res.status(400).json({
        response,
      });
    }
    // handles when insurance does not exist
    else if (!insurance) {
      const response = {
        status: "failed",
        message: "insurance company does not exist",
      };
      res.status(404).json({
        response,
      });
    } 
    else {
      fetchAllPatientsService(insurance.wallet).then(async (response) => {
        // console.log(response.data.patients[0]['authorizedInsuranceCompanies']);
        const patientsArray = response.data.patients;
        const patientIdsArray = await Promise.all(
          patientsArray.map((patient) => {
            if (patient["authorizedInsuranceCompanies"].includes(insurance.wallet))
              return patient["patientId"];
            else return null;
          })
        );

        // removing null values
        const filteredPatientIdsArray = patientIdsArray.filter(
          (id) => id !== null
        );

        const patientDetailsArray = await Promise.all(
          filteredPatientIdsArray.map(async (id)=> {
            const patient = await Patient.findOne({patientId: id})
            return patient;
          })
        )
        response.data.patients = undefined;
        response.data.patients = patientDetailsArray;
        res.send(response);
      });
    }
  } catch (error) {}
};

module.exports = {
  insuranceAcceptController,
  insuranceRejectController,
  insuranceViewPolicyController,
  insuranceAcceptController,
  fetchInsuranceCompanyProfileController,
  insuranceSignInController,
  insuranceSignOutController,
  insuranceViewPolicyClaimsController,
  insuranceViewPolicyClaimsDataController,
  viewPolicyClaimsDataController,
  fetchAuthorizedPatientsController
};
