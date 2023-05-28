const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HospitalSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [8, "Password should contain atleast 8 characters"],
        },
        address: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        wallet: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Hospital = mongoose.model("Hospital", HospitalSchema);
module.exports = Hospital;
