
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const patientSchema = new Schema({
    km
},{timestamps:true});

const Patient =mongoose.model('Patient',patientSchema);
module.exports =Patient;