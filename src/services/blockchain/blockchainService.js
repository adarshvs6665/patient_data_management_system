// configuring environment
require("dotenv").config();

const Web3 = require("web3");

// importing artifacts
const contractArtifact = require("../../../build/contracts/MedicalRecords.json");

// address of deployed contract
const contractAddress = process.env.MEDICAL_RECORD_CONTACT_ADDR;

// connection to ganache network
const ganacheConnectionUrl =
  "http://" + process.env.GANACHE_HOST + ":" + process.env.GANACHE_PORT;
const web3 = new Web3(ganacheConnectionUrl);
const contract = new web3.eth.Contract(contractArtifact.abi, contractAddress);

// fetch admin address
const fetchAdminAddressService = async () => {
  try {
    const adminAddress = await contract.methods.getAdminAddress().call();
    // console.log("Admin address:", adminAddress);
    const response = {
      status: "success",
      message: "fetched admin address",
      data: {
        adminAddress,
      },
    };
    return response;
  } catch (error) {
    // console.error("Error calling getAdminAddress:", error);
    const response = {
      status: "failed",
      message: "error fetching admin address",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// create a hospital
const createHospitalService = async (
  adminAccount,
  hospitalAddress,
  hospitalId
) => {
  try {
    // Call the createHospital function
    const transaction = contract.methods.createHospital(
      hospitalAddress,
      hospitalId
    );
    const gas = await transaction.estimateGas({ from: adminAccount });
    const result = await transaction.send({ from: adminAccount, gas });
    const response = {
      status: "success",
      message: "created hospital successfully",
      data: {
        transactionHash: result.transactionHash,
      },
    };
    return response;
  } catch (error) {
    // console.error("Error calling createHospital:", error);
    const response = {
      status: "failed",
      message: "error while creating hospital",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// fetch all hospitals
const fetchAllHospitalsService = async () => {
  try {
    const hospitals = await contract.methods.getAllHospitals().call();
    // console.log("List of hospitals:", hospitals);
    const response = {
      status: "success",
      message: "fetched hospitals successfully",
      data: {
        hospitals,
      },
    };
    return response;
  } catch (error) {
    // console.error("Error calling getAllHospitals:", error);
    const response = {
      status: "failed",
      message: "error while fetching hospitals",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// create a patient
const createPatientService = async (
  hospitalAccount,
  patientAddress,
  patientId
) => {
  try {
    // Call the addPatient function
    const transaction = contract.methods.addPatient(patientAddress, patientId);
    const gas = await transaction.estimateGas({ from: hospitalAccount });
    const result = await transaction.send({ from: hospitalAccount, gas });
    // console.log(
    //     "Patient added successfully. Transaction hash:",
    //     result.transactionHash
    // );
    const response = {
      status: "success",
      message: "created patient successfully",
      data: {
        transactionHash: result.transactionHash,
      },
    };
    return response;
  } catch (error) {
    // console.error("Error calling addPatient:", error);
    const response = {
      status: "failed",
      message: "error while creating patient",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// fetch all patients
const fetchAllPatientsService = async () => {
  try {
    const patients = await contract.methods.getAllPatients().call();
    // console.log("List of patients:", patients);

    const response = {
      status: "success",
      message: "fetched patients successfully",
      data: {
        patients,
      },
    };
    return response;
  } catch (error) {
    // console.error("Error calling getAllPatients:", error);
    const response = {
      status: "failed",
      message: "error while fetching patients",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// create an insurance company
const createInsuranceCompanyService = async (
  adminAccount,
  insuranceCompanyAddress,
  insuranceProviderId
) => {
  try {
    // Call the createInsuranceCompany function
    const transaction = contract.methods.createInsuranceCompany(
      insuranceCompanyAddress,
      insuranceProviderId
    );
    const gas = await transaction.estimateGas({ from: adminAccount });
    const result = await transaction.send({ from: adminAccount, gas });

    const response = {
      status: "success",
      message: "created insurance company successfully",
      data: {
        transactionHash: result.transactionHash,
      },
    };
    return response;
  } catch (error) {
    const response = {
      status: "failed",
      message: "error while creating insurance company",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// fetch all insurance companies
const fetchAllInsuranceCompaniesService = async () => {
  try {
    const insuranceCompanies = await contract.methods
      .getAllInsuranceCompanies()
      .call();
    // console.log("List of insurance companies:", insuranceCompanies);
    const response = {
      status: "success",
      message: "fetched insurance companies successfully",
      data: {
        insuranceCompanies,
      },
    };
    return response;
  } catch (error) {
    // console.error("Error calling getAllInsuranceCompanies:", error);
    const response = {
      status: "failed",
      message: "error while fetching insurance companies",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// update patient data ( newPatientData is stringified JSON)
const updatePatientReportService = async (
  hospitalAddress,
  patientAddress,
  newPatientData
) => {
  try {
    // PATIENT DATA FORMAT

    // const patientDataJSON = {
    //     content: "exists",
    //     data: {
    //         cancer: "true",
    //     },
    // };

    // Call the updatePatientData function
    const transaction = contract.methods.updatePatientData(
      patientAddress,
      JSON.stringify(newPatientData)
    );
    const gas = await transaction.estimateGas({ from: hospitalAddress });
    const result = await transaction.send({ from: hospitalAddress, gas });

    // console.log("Patient data updated successfully!");
    const response = {
      status: "success",
      message: "updated patient data successfully",
      data: {
        transactionHash: result.transactionHash,
      },
    };
    return response;
  } catch (error) {
    // console.error("Error updating patient data:", error);
    const response = {
      status: "failed",
      message: "error while updating patient data",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// fetch authorized hospitals for a patient
const fetchAuthorizedHospitalsService = async (patientAddress) => {
  try {
    // Call the getAuthorizedHospitals function in the contract
    const authorizedHospitals = await contract.methods
      .getAuthorizedHospitals(patientAddress)
      .call();

    // console.log("Authorized hospitals:", authorizedHospitals);
    const response = {
      status: "success",
      message: "fetched authorized hospitals successfully",
      data: {
        authorizedHospitals,
      },
    };
    return response;
  } catch (error) {
    // console.error("Error getting authorized hospitals:", error);
    const response = {
      status: "failed",
      message: "error while fetching authorized hospitals",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// fetch authorized insurance companies for a patient
const fetchAuthorizedInsuranceCompaniesService = async (patientAddress) => {
  try {
    // Call the getAuthorizedInsuranceCompanies function in the contract
    const authorizedInsuranceCompanies = await contract.methods
      .getAuthorizedInsuranceCompanies(patientAddress)
      .call();

    // console.log(
    //     "Authorized insurance companies:",
    //     authorizedInsuranceCompanies
    // );
    const response = {
      status: "success",
      message: "fetched authorized insurance companies successfully",
      data: {
        authorizedInsuranceCompanies,
      },
    };
    return response;
  } catch (error) {
    // console.error("Error getting authorized insurance companies:", error);
    const response = {
      status: "failed",
      message: "error while fetching authorized insurance companies",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// function to authorize an insurance company for the patient
const addAuthorizedInsuranceCompanyService = async (
  hospitalAddress,
  patientAddress,
  insuranceAddress
) => {
  try {
    const transaction = contract.methods.addAuthorizedInsuranceCompany(
      patientAddress,
      insuranceAddress
    );
    const gas = await transaction.estimateGas({ from: hospitalAddress });
    const result = await transaction.send({ from: hospitalAddress, gas });

    const response = {
      status: "success",
      message: "authorized insurance company successfully",
      data: {
        transactionHash: result.transactionHash,
      },
    };
    return response;
  } catch (error) {
    // console.error('Error adding insurance company:', error);
    const response = {
      status: "failed",
      message: "error while authorizing insurance company",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// function to authorize a hospital company for the patient
const addAuthorizedHospitalService = async (
  hospitalAddress,
  patientAddress,
  hospitalAddressToBeAuthorized
) => {
  try {
    const transaction = contract.methods.addAuthorizedHospital(
      patientAddress,
      hospitalAddressToBeAuthorized
    );
    const gas = await transaction.estimateGas({ from: hospitalAddress });
    const result = await transaction.send({ from: hospitalAddress, gas });

    const response = {
      status: "success",
      message: "authorized hospital successfully",
      data: {
        transactionHash: result.transactionHash,
      },
    };
    return response;
  } catch (error) {
    const response = {
      status: "failed",
      message: "error while authorizing hospital",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// function to retrieve all wallet addresses from ganache
const fetchWalletAddressesService = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const response = {
      status: "success",
      message: "fetched wallet addresses successfully",
      data: {
        length: accounts.length,
        accounts,
      },
    };
    return response;
  } catch (error) {
    const response = {
      status: "failed",
      message: "error while fetching wallet addresses",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// fetch medical records contract address
const fetchMedicalRecordsContractService = async () => {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    let contractAddresses = [];

    for (let i = 0; i <= blockNumber; i++) {
      const block = await web3.eth.getBlock(i);
      for (const txHash of block.transactions) {
        const receipt = await web3.eth.getTransactionReceipt(txHash);
        if (receipt.contractAddress) {
          contractAddresses.push(receipt.contractAddress);
        }
      }
    }

    const response = {
      status: "success",
      message: "fetched medical records contract address successfully",
      data: {
        contractAddress: contractAddresses[contractAddresses.length - 2],
      },
    };
    return response;
  } catch (error) {
    const response = {
      status: "failed",
      message: "error while fetching medical records contract address",
      data: {
        error: error.message,
      },
    };
    return response;
  }
};

// fetch information about single patient
const fetchPatientInfoService = async (patientAddress) => {
  try {
    const patientInfo = await contract.methods
      .getPatientInfo(patientAddress)
      .call();
    const response = {
      status: "success",
      message: "fetched patient information successfully",
      data: {
        patientInfo: patientInfo,
      },
    };

    return response;
  } catch (error) {
    const response = {
      status: "failed",
      message: "error while fetching patient information",
      data: {
        error: error.message,
      },
    };

    return response;
  }
};

// fetch information about single hospital
const fetchHospitalInfoService = async (hospitalAddress) => {
  try {
    const hospitalInfo = await contract.methods
      .getHospitalInfo(hospitalAddress)
      .call();

    const response = {
      status: "success",
      message: "fetched hospital information successfully",
      data: {
        hospitalInfo: hospitalInfo,
      },
    };

    return response;
  } catch (error) {
    const response = {
      status: "failed",
      message: "error while fetching hospital information",
      data: {
        error: error.message,
      },
    };

    return response;
  }
};

// fetch information about single insurance company
const fetchInsuranceCompanyInfoService = async (insuranceCompanyAddress) => {
  try {
    const insuranceCompanyInfo = await contract.methods
      .getInsuranceCompanyInfo(insuranceCompanyAddress)
      .call();

    const response = {
      status: "success",
      message: "fetched insurance company information successfully",
      data: {
        insuranceCompanyInfo: insuranceCompanyInfo,
      },
    };

    return response;
  } catch (error) {
    const response = {
      status: "failed",
      message: "error while fetching insurance company information",
      data: {
        error: error.message,
      },
    };

    return response;
  }
};

module.exports = {
  addAuthorizedHospitalService,
  addAuthorizedInsuranceCompanyService,
  createHospitalService,
  createInsuranceCompanyService,
  createPatientService,
  fetchAdminAddressService,
  fetchAllHospitalsService,
  fetchAllInsuranceCompaniesService,
  fetchAllPatientsService,
  fetchAuthorizedHospitalsService,
  fetchAuthorizedInsuranceCompaniesService,
  fetchInsuranceCompanyInfoService,
  fetchMedicalRecordsContractService,
  fetchPatientInfoService,
  fetchHospitalInfoService,
  fetchWalletAddressesService,
  updatePatientReportService,
};
