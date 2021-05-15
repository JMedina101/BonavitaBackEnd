const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    shippingId: {
        type:mongoose.Schema.ObjectId
    },
    location: {
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    }
});

const shipping = mongoose.model("Shipping",shippingSchema);
module.exports = shipping;