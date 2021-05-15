const mongoose = require('mongoose');


const transactionProduct = new mongoose.Schema({
    transactionId: {
        type:mongoose.Schema.ObjectId,
        required:true

    },
    productId: {
        type:mongoose.Schema.ObjectId,
        required:true
    },
    productName: {
        type:String,
        required:true
    },
    quantityBought: {
        type:Number,
        required:true
    },
    total: {
        type:Number,
        required:true
    }
});


const productTransact = mongoose.model('productTransaction',transactionProduct);



module.exports = productTransact;
