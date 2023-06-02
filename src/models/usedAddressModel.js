const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsedAddressSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
});

const UsedAddress = mongoose.model("UsedAddress", UsedAddressSchema);
module.exports = UsedAddress;
