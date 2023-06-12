# Patient Management System on Ganache Ethereum Blockchain


## Introduction
The Patient Management System is a decentralized application built on the Ethereum blockchain using Node.js, Ganache, and smart contracts. This system allows for the secure storage of patient records through the utilization of smart contracts. The application supports four main types of users: admin, hospital, patient, and insurance.

## Features
- Admin:
  - Creates insurance companies and hospitals
- Hospital:
  - Creates patients
  - Assigns patients to hospitals and insurances
  - Creates medical records for patients
- Patient:
  - Logs in to their account
  - Views their profile
- Insurance:
  - Logs in to their account
  - Views details and medical records of patients assigned to them

## Technologies Used
- Node.js
- Ethereum Ganache
- Solidity (smart contract development language)
- MongoDB (backend database)
- REST API (to interact with the MongoDB database)
- JSON (data format for REST API responses)
- HTML, CSS, and JavaScript (frontend application)

## Installation
1.  Clone the repository:
    ```console
    git clone https://github.com/adarshvs6665/patient_data_management_system.git

2.  Install dependencies:    
    ```console
    cd patient_data_management_system
    npm install

3. Start Ganache Ethereum blockchain in cli or using Ganache UI

4. Set up MongoDB database

Download MongoDB community server and install in your system

5.  Deploy smart contracts:
    ```console
    truffle migrate --reset

6. In Ganache go to contracts page and click on medical records page from there copy the contract address and paste it in the env file

    ```console
    `MEDICAL_RECORD_CONTACT_ADDR = copied address`

## Usage
1.  Start the backend REST API server:
    ```console
    patient_data_management_system
    npm start

2.  Start the frontend application server:

- [You can clone front end from here](https://github.com/adarshvs6665/patient_dms_ui.git)
    ```console
    cd patient_dms_ui
    npm start

3. Start Ganache Ethereum blockchain in cli or using Ganache UI

4. Access the application by opening your web browser and visiting 
    `http://localhost:3000`

## Contributing

Contributions to the Patient Management System project are welcome! If you find any issues or have ideas to enhance the functionality of the system, you can contribute by following these steps:

1. Fork the repository on GitHub.
2. Clone the forked repository to your local machine.
3. Make the necessary changes or additions to the codebase.
4. Ensure that your changes follow the project's code style and conventions.
5. Test your changes to ensure they work as intended.
6. Commit your changes and push them to your forked repository.
7. Submit a pull request from your forked repository to the main repository.

Please provide a clear and descriptive explanation of the changes you have made in your pull request. This will help reviewers understand your contributions better.

## License

The Patient Management System project is licensed under the MIT License. You can find the full text of the license in the [LICENSE](link-to-license-file) file.

## Acknowledgments

Special thanks to the following resources that have been instrumental in the development of the Patient Management System:

- Ethereum: A decentralized platform for building blockchain-based applications.
- Ganache: A personal blockchain for Ethereum development.
- Solidity: A programming language for writing smart contracts on the Ethereum platform.
- Node.js: A JavaScript runtime for server-side development.
- MongoDB: A popular NoSQL database used for storing and retrieving data.

These resources have provided valuable tools and technologies that have contributed to the functionality and development of the Patient Management System.
    



