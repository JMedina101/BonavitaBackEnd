const mongoose = require('mongoose');

const faqContentSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.ObjectId
    },
    contentCategory: {
        type:String,
        required:true
    },
    contentHeading: {
        type:String,
        required:true
    },
    contentBody: {
        type:String,
        required:true
    }
});
const faq = mongoose.model('faqContent',faqContentSchema);
module.exports = faq;

