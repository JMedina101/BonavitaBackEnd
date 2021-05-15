const mongoose = require('mongoose');

const transactionRecord = new mongoose.Schema({
    products:[{
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

    }]
});


const transaction = mongoose.model('recordsofTransaction',transactionRecord);

module.exports = transaction;
