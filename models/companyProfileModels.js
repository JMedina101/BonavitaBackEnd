const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
    companyName: {
        type:String,
        required:true
    },
    Address: {
        type:String,
        required:true
    },
    lazadaUrl: {
        type:String  

    },
    facebookUrl: {
        type:String  
    },
    instagramUrl: {
        type:String  
    },
    twiterUrl : {
        type:String  
    },
    emailAddress: {
        type:String,
        required:true
    },
    TelNum: {
        type:Number
    },
    CpNum: {
        type:Number
    },logo: {
        type:String
    },banner: {
        type:String
    }
});


const companyProfile = mongoose.model('companyProfile',companyProfileSchema);
module.exports = companyProfile;

