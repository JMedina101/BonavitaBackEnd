const mongoose = require('mongoose');

const TransactionCustomerSchema =  new mongoose.Schema({
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
    products: [{
        productName: {
            type:String,
            required:true

        },
        itemBought: {
            type:Number,
            required:true
        },
        total: {
            type:Number,
            required:true

        }

    }],
    subTotal: {
        type:Number,
        required:true
    },
    date: {
        type: Date, default: Date.now
    }

});

const transactionCustomer = mongoose.model("TransactionCustomer",TransactionCustomerSchema);
module.exports = transactionCustomer;