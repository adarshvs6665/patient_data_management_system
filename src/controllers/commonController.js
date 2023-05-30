const {
    fetchWalletAddressesService,
    fetchPatientInfoService,
} = require("../services/blockchain/blockchainService");

const commonViewPatientDetails = async (req, res) => {
    const { patientAddress } = req.query;
    if (!patientAddress) {
        const response = {
            status: "failed",
            message: "please provide a patient address",
        };

        res.status(400).json(response);
    } else {
        fetchPatientInfoService(patientAddress).then((response) => {
            if (response.status != "success") {
                console.log(response);
                res.status(404).json(response);
            }
            res.status(200).json(response);
        });
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
    commonViewPatientDetails,
    fetchAllWalletAddressesController,
};
