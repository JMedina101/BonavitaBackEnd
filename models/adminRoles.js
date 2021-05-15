const mongoose = require('mongoose');

const adminRole =  new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    role: {
        type:String,
        required:true
    },
    date: {
        type: Date, default: Date.now
        
    }
});

const role = mongoose.model('adminRole',adminRole); 

module.exports = role;