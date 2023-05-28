// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MedicalRecords {
    address public admin;

    struct Patient {
        string patientId;
        address[] authorizedHospitals;
        address[] authorizedInsuranceCompanies;
        string patientData;
    }

    struct InsuranceCompany {
        string insuranceProviderId;
        address[] patientAddresses;
    }

    struct Hospital {
        string hospitalId;
        address[] patientAddresses;
    }

    // mappings to store patient, insurance company and hospitals
    mapping(address => Patient) public patients;
    mapping(address => InsuranceCompany) public insuranceCompanies;
    mapping(address => Hospital) public hospitals;

    // arrays to store addresses
    address[] public hospitalAddresses;
    address[] public patientAddresses;
    address[] public insuranceCompanyAddresses;

    // restricts to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    // restricts to hospital
    modifier onlyHospital() {
        require(
            bytes(hospitals[msg.sender].hospitalId).length != 0,
            "Only a hospital can perform this action."
        );
        _;
    }

    // Modifier to restrict access to authorized hospitals
    modifier onlyAuthorizedHospital(address patientAddress) {
        bool isAuthorized = false;
        for (
            uint256 i = 0;
            i < patients[patientAddress].authorizedHospitals.length;
            i++
        ) {
            if (patients[patientAddress].authorizedHospitals[i] == msg.sender) {
                isAuthorized = true;
                break;
            }
        }
        require(
            isAuthorized,
            "Only authorized hospitals can perform this action."
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Function to view the admin address
    function getAdminAddress() public view returns (address) {
        return admin;
    }

    // function to create hospital by admin
    function createHospital(
        address hospitalAddress,
        string memory hospitalId
    ) public onlyAdmin {
        hospitals[hospitalAddress].hospitalId = hospitalId;
        hospitals[hospitalAddress].patientAddresses = new address[](0);
        hospitalAddresses.push(hospitalAddress);
    }

    // function to create insurance company by admin
    function createInsuranceCompany(
        address insuranceCompanyAddress,
        string memory insuranceProviderId
    ) public onlyAdmin {
        insuranceCompanies[insuranceCompanyAddress]
            .insuranceProviderId = insuranceProviderId;
        insuranceCompanies[insuranceCompanyAddress]
            .patientAddresses = new address[](0);

        insuranceCompanyAddresses.push(insuranceCompanyAddress);
    }

    function addPatient(
        address patientAddress,
        string memory patientId
    ) public onlyHospital {
        patients[patientAddress].patientId = patientId;
        patients[patientAddress].authorizedHospitals.push(msg.sender);
        patients[patientAddress].patientData = '{"content":"null"}';

        // adding patient to the patient list of the hospital
        hospitals[msg.sender].patientAddresses.push(patientAddress);

        patientAddresses.push(patientAddress);
    }

    // get all hospital details
    function getAllHospitals() public view returns (Hospital[] memory) {
        Hospital[] memory allHospitals = new Hospital[](
            hospitalAddresses.length
        );

        for (uint256 i = 0; i < hospitalAddresses.length; i++) {
            allHospitals[i] = hospitals[hospitalAddresses[i]];
        }

        return allHospitals;
    }

    function getAllPatients() public view returns (Patient[] memory) {
        Patient[] memory allPatients = new Patient[](patientAddresses.length);

        for (uint256 i = 0; i < patientAddresses.length; i++) {
            allPatients[i] = patients[patientAddresses[i]];
        }

        return allPatients;
    }

    function getAllInsuranceCompanies()
        public
        view
        returns (InsuranceCompany[] memory)
    {
        InsuranceCompany[]
            memory allInsuranceCompanies = new InsuranceCompany[](
                insuranceCompanyAddresses.length
            );

        for (uint256 i = 0; i < insuranceCompanyAddresses.length; i++) {
            allInsuranceCompanies[i] = insuranceCompanies[
                insuranceCompanyAddresses[i]
            ];
        }

        return allInsuranceCompanies;
    }

    function getPatientInfo(
        address patientAddress
    ) public view returns (Patient memory) {
        return patients[patientAddress];
    }

    function getHospitalInfo(
        address hospitalAddress
    ) public view returns (Hospital memory) {
        return hospitals[hospitalAddress];
    }

    function getInsuranceCompanyInfo(
        address insuranceCompanyAddress
    ) public view returns (InsuranceCompany memory) {
        return insuranceCompanies[insuranceCompanyAddress];
    }

    // update patient data
    // Function to update the patientData of a specific patient
    function updatePatientData(
        address patientAddress,
        string memory newPatientData
    ) public onlyAuthorizedHospital(patientAddress) {
        patients[patientAddress].patientData = newPatientData;
    }

    function getAuthorizedHospitals(
        address patientAddress
    ) public view returns (address[] memory) {
        return patients[patientAddress].authorizedHospitals;
    }

    // Function to get the addresses of authorized insurance companies for a patient
    function getAuthorizedInsuranceCompanies(
        address patientAddress
    ) public view returns (address[] memory) {
        return patients[patientAddress].authorizedInsuranceCompanies;
    }

    // authorized hospital can push a insurance company to the authorized insurance companies list
    function addAuthorizedInsuranceCompany(
        address patientAddress,
        address insuranceCompanyAddress
    ) public onlyAuthorizedHospital(patientAddress) {
        patients[patientAddress].authorizedInsuranceCompanies.push(
            insuranceCompanyAddress
        );
    }

    // authorized hospital can push a another hospital to the authorized hospitals list
    function addAuthorizedHospital(
        address patientAddress,
        address hospitalAddress
    ) public onlyAuthorizedHospital(patientAddress) {
        patients[patientAddress].authorizedHospitals.push(hospitalAddress);
    }
}
