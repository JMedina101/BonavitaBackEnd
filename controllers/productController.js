const productsSchema = require('./../models/productModels');
const companyProfile = require('./../models/companyProfileModels');


exports.showAllProducts = async(req,res,next)=> {
    // as a defualt all values that the render will get is in views
    let Products;
    let user = res.locals;
    const profile = await companyProfile.findOne();
   try {
         Products = await productsSchema.find();
   }
   catch(err) {
       res.status(400).json({
         err
       });
   }

   res.status(200).render('index',{
      user,Products,profile
   });
}

exports.feedback = async (req,res,next)=> {
  res.status(200).render('feedback');
}

