const {
    fetchWalletAddressesService,
} = require("../services/blockchain/blockchainService");

const commonViewPatientDetails = async (req, res) => {};

const fetchAllWalletAddressesController = async (req, res) => {
    console.log("hit");
    try {
        fetchWalletAddressesService().then((response) => {
            if (response.status == "success") {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        });
    } catch (error) {
        const response = {
            status: "failed",
            message: error.message,
        };
        res.status(400).send(response);
    }
};

module.exports = {
    commonViewPatientDetails,
    fetchAllWalletAddressesController,
};
