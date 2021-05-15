const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    ProductId: {
        type: mongoose.Schema.ObjectId,

    },
    ProductName: {
        type:String,
        required:true
    },
    ProductStock: {
        type:Number,
        required:true

    },
    ProductPrice: {
        type:Number,
        required:true
    },
    ProductDescription: {
        type:String
    },
    ProductRating: {
        type:Number
    },
    ProductImage: {
        type:String
    }
});

const product = mongoose.model("Product",ProductSchema);
module.exports = product;


