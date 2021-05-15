const mongoose = require('mongoose');

const address =  new mongoose.Schema({
    userId: {
        type:mongoose.Schema.ObjectId,
        required:true
    },
    homeAddress: {
        type:String,
        required:true
    },
    Street: {
            type:String,
            required:false
    },
    Subdv: {
            type:String,
            required:true
    },
    Barangay: {
            type:String,
            required:true
    },
    City: {
            type:String,
            required:true
    },
    postalCode: {
            type:String,
            required:true
    }
});

const Address = mongoose.model('address',address);

module.exports = Address;