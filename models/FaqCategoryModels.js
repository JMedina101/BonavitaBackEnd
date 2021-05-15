const mongoose = require('mongoose');

const faqCategorySchema = new mongoose.Schema({
    FaqId: {
        type: mongoose.Schema.ObjectId

    },
    FaqCategory: {
        type:String,
        required:true,
        unique:true
    } 
});
const faqCategory = mongoose.model("Faq",faqCategorySchema);

module.exports = faqCategory;


