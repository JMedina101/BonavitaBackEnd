const mongoose = require('mongoose');

const testimonial = new mongoose.Schema({
    testimonialHeading: {
        type:String,
        required:true

    },
    testimonialBody: {
        type:String,
        required:true

    },
    Author: {
        type:String,
        required:true
    }
});

const Testimonial = mongoose.model('testimonial',testimonial);
module.exports = Testimonial;