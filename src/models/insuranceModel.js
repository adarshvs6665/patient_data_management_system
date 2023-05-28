const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InsuranceSchema = new Schema(
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

const Insurance = mongoose.model("Insurance", InsuranceSchema);
module.exports = Insurance;
