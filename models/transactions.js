const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type:mongoose.Schema.ObjectId

    },
    userId: {
        type:mongoose.Schema.ObjectId,
        required:true
    },
    shippingFee: {
        type:Number,
        required:true
    },
    paymentMethod: {
        type:String,
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
    province: {
            type:String,
            required:true
    },
    postalCode: {
            type:String,
            required:true
    },
    status: {
        type:Boolean,
        default:false,
        required:true
    },name: {
        type:String,
        required:true

    }, phoneNumber: {
        type:Number,
        required:true
    },
    notes: {
        type:String
    },
    date: {
        type: Date, default: Date.now
    }
});
const transaction = mongoose.model('transaction', transactionSchema);
module.exports = transaction;
