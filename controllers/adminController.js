const Product = require('../models/productModels');
const Shipping = require('../models/shippingModels');
const Faq = require('../models/FaqCategoryModels');
const FaqContentModels = require('../models/FaqContentModels');
const Transaction = require('./../models/transactions');
const productTransaction = require('./../models/transactionProducts');

const adminRole = require('./../models/adminRoles');
const sendEmail = require('./../utils/email');
const companyProfile = require('./../models/companyProfileModels');

const customerTransactions = require('./../models/transactionsCustomer');
const testimonial = require('./../models/testimonials');


const { compareSync } = require('bcrypt');
const customer = require('../models/userModel');
const { head } = require('../routes/viewsRoute');
const { update } = require('../models/productModels');

const multer = require('multer');
const Address = require('../models/Addresses');

const User = require('./../models/userModel');
const multerStorage = multer.diskStorage({
    destination:(req,file,cb)=> {
        cb(null,'public/img');
    },
    filename:(req,file,cb)=> {
        const ext = file.mimetype.split('/')[1];
        cb(null,`product-${Date.now()}.${ext}`)
    }
});

const multerFilter = (req,file,cb)=> {
    if(file.mimetype.startsWith('image'))
    {
        cb(null,true);
        
    }
}
const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
});


exports.uploadProduct = upload.single('product');

exports.uploadCompanyInfos = upload.fields([{
    name:'logo',maxCount:1
},{name:'banner',maxCount:1}])

let category;
exports.products = async(req,res,next)=> {
    const Products = await Product.find();
    const user =req.user;
    res.status(200).render('adminProducts',{
        Products,user
    });
}
exports.shipping = async(req,res,next)=> {
    const user =req.user;
    const shipping = await Shipping.find();
    res.status(200).render('adminShipping',{
        shipping,user
    });

}
exports.shippingPost = async(req,res,next)=> {
    const location = req.body.location;
    const price = req.body.price;

    await Shipping.create({
        location,price

    });
    res.redirect('/adminShipping');

}

exports.Faq = async(req,res,next)=> {
    const user =req.user;
    let indicator = false;
    const query = req.query.category;
    const FaqCategory = await Faq.find();
    const contents = await FaqContentModels.find({
        contentCategory:query
    });

    if(query) {
        indicator = true;   
        passCategory(query);
        res.status(200).render('adminFaq',{
            indicator,FaqCategory,contents,user
        });
    }
    else {
        indicator = false;
        res.status(200).render('adminFaq',{
            indicator,FaqCategory,user
        });
    }
    
    
 
}
function passCategory(query) {
    category = query;
}

exports.faqCategory = async(req,res,next)=> {
    const category = req.body.category;
    await Faq.create({
            FaqCategory:category
        });
    res.redirect('/adminFaq');  
}

exports.deleteCategory = async (req,res,next)=> {
    
    // delete the specific category and all values under it
    const FaqCategoryId = req.query.categoryId;
    if(FaqCategoryId) {
        const faq =  await Faq.findByIdAndDelete(FaqCategoryId);
        contentCategory = faq.FaqCategory;
        const deletedCategory = await FaqContentModels.deleteMany({
            contentCategory
        });
        
        res.redirect('/adminFaq');
    }

}
exports.postFAQ = async(req,res,next)=> {
    
    const foundCategory = await Faq.findOne({FaqCategory:category});
    if(foundCategory)
    {
        await FaqContentModels.create({
            contentCategory:category,
            contentHeading:req.body.heading,
            contentBody:req.body.body
    
        });
     
       res.redirect('/adminFaq');
    }
}
exports.getEditPage = async(req,res,next)=> {
    
    
    const user =req.user;

    const shippingId = req.query.shippingId;
    const productId  = req.query.productId;
    const adminFaqId   = req.query.FaqId; 
    const testimonialId = req.query.testimonialId;

    let shipping,product,adminFaq,testimonials;
    
    if(shippingId) {
       shipping = await Shipping.findById(shippingId);
    }
    else if (productId) {
        product = await Product.findById(productId);
    }
    else if(adminFaqId) {
         adminFaq = await FaqContentModels.findById(adminFaqId);
        console.log(adminFaq)
    }
    else if(testimonialId) {
        testimonials = await testimonial.findById(testimonialId);
    }
    res.status(200).render('adminEditProducts',{
        shipping,product,adminFaq,testimonials,user
    });
}
exports.updateEditPage = async(req,res,next)=> {
    const shippingId = req.query.shippingId;
    const productId  = req.query.productId;
    const adminFaqId   = req.query.FaqId; 
    const transactionId = req.query.testimonialId;

    if(productId) {
        const ProductName = req.body.ProductName;
        const ProductPrice = req.body.ProductPrice;
        const ProductStock = req.body.ProductStock;
        const ProductDescription = req.body.ProductDescription;
        let ProductImage = req.body.productImage;
        console.log(req.body);

        if(req.file)
        {
            ProductImage= req.file.filename;
        }
          await Product.findByIdAndUpdate(productId,{
            ProductName,ProductPrice,ProductStock,ProductDescription,ProductImage
         });
         res.redirect('/adminProducts');
        
    }
    if(adminFaqId) {
        const contentHeading = req.body.contentHeading;
        const contentBody = req.body.contentBody;

        await FaqContentModels.findByIdAndUpdate(adminFaqId, {
            contentHeading,contentBody
        });
        res.redirect('/adminFaq');
    }
    if(shippingId) {
        location = req.body.location;
        price = req.body.price;
        await Shipping.findByIdAndUpdate(shippingId,{
            location,price
        });
        res.redirect('/adminShipping');
    }
    if(transactionId) {
        const Author = req.body.author;
        const testimonialHeading = req.body.testimonialHeading;
        const testimonialBody = req.body.testimonialBody;
        console.log(req.body);
        await testimonial.findByIdAndUpdate(transactionId,{
            Author,testimonialHeading,testimonialBody
        });
        res.redirect('/adminTestimonials');
    }
}

exports.delete = async (req,res,next)=> {
    const shippingId = req.query.shippingId;
    const productId  = req.query.productId;
    const adminFaqId = req.query.FaqId; 
    const adminId = req.query.adminId;
    const testimonialId = req.query.testimonialId;

    if(productId) {
        await Product.findByIdAndDelete(productId);
        res.redirect("/adminProducts")
    }
    if(shippingId) {
        await Shipping.findByIdAndDelete(shippingId);
        res.redirect("/adminShipping")
    }
    if(adminFaqId) {
        await FaqContentModels.findByIdAndDelete(adminFaqId);
        res.redirect("/adminFaq");
    }
    if(adminId) {
        await adminRole.findByIdAndDelete(adminId);
        res.redirect("/adminRoles");

    }
    if(testimonialId) {
        await testimonial.findByIdAndDelete(testimonialId);
        res.redirect("/adminTestimonials");
    }
    
}
exports.postProduct = async(req,res,next)=> {

    const files = req.file;
    
    ProductName = req.body.ProductName;
    ProductPrice = req.body.ProductPrice;
    ProductStock = req.body.ProductStock;
    ProductDescription = req.body.ProductDescription;
    ProductImage = req.file.filename;

    await Product.create({
        ProductName,ProductPrice,ProductStock,ProductDescription,ProductImage
    });
    res.redirect('/adminProducts');
}



exports.faq = async(req,res,next)=> {
    const user = res.locals;

    const categories = await Faq.find();
    let faqContent
    const contentCategory = req.query.category;

    const profile = await companyProfile.findOne();

    if(contentCategory)
    {    
        faqContent = await FaqContentModels.find({
            contentCategory
        });
        console.log(faqContent);
    }
    res.status(200).render('faq',{
        contentCategory,categories,faqContent,profile,user
    });
}
exports.userProfile = async(req,res,next)=> {
    const user = req.user;
    
    const error =req.query.error;

    const profile = await companyProfile.findOne();

    res.status(200).render('myAccount',{
        user,profile,error
    });
}

exports.userTransaction = async(req,res,next)=> {
    // problem wala siyang access doon sa mga values na objects
    // 
    const user = req.user;
    const profile = await companyProfile.findOne();

    const myTransactions = await customerTransactions.find({userId:user.id});

    res.render('myTransactions',{myTransactions,profile});
}

exports.addProductPage = async(req,res,next)=> {
    const user =req.user;
    res.status(200).render('adminAddProducts',{user});
}

exports.acceptOrder = async(req,res,next)=> {
    const user = req.user;
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const notes = req.body.notes;

    const homeAddress = req.body.homeAddress
    const Street = req.body.streetName
    const Subdv = req.body.subdv
    const Barangay = req.body.Barangay
    const City = req.body.city
    const province = req.body.provinceLocation
    const postalCode = req.body.postalCode;
    const subTotal = req.body.SubTotal;
   
    const shippingFee = req.body.shippingPrice;
    const paymentMethod = req.body.modeOfPayment;
    
    const quantity = req.body.quantity;
    const eachProduct = req.body.productName;
    const productPrice = req.body.productPrice; 

    const profile = await companyProfile.findOne();

    const transact = await customerTransactions.create({
        userId:user.id, shippingFee,paymentMethod,homeAddress,Street,Subdv,Barangay,City,province,postalCode,name,phoneNumber,notes,subTotal
    });

    for( var i = 0; i < quantity.val.length; i++)
    {
        products = {
            productName:eachProduct.val[i],
            itemBought:quantity.val[i],
            total:productPrice.val[i]
        }
        await customerTransactions.updateOne({_id:transact.id}, { $push: { products: products }})
        const updateStock = await Product.findOne({ProductName:eachProduct.val[i]});
        
        const stock = updateStock.ProductStock - quantity.val[i];

        console.log("Before update ");
        console.log(updateStock);
        const updatedStock = await Product.findOneAndUpdate({ProductName:eachProduct.val[i]},{
             ProductStock: stock});
        
        
        console.log("updated stock");
        console.log(updatedStock);
    }  
    const finalTransaction = await customerTransactions.findById(transact);
    // console.log(finalTransaction.products);

      res.status(200).render('success',{
        finalTransaction,profile
     });
     
}

exports.welcome = async(req,res,next)=> {
    const user =req.user;
    res.status(200).render('adminWelcome',{user});
}

exports.getadminRoles = async(req,res,next)=> {
    const user =req.user;
    const admin = await adminRole.find();
    res.status(200).render('adminRole',{admin,user});
}

exports.postAdminRoles = async(req,res,next)=> {

    const adminUser = await adminRole.create(req.body);
    const email = req.body.email;
    const role = req.body.role;

    
    const adminPriviledge = `${req.protocol}://${req.get(
        'host'
      )}/adminSignUp`;

      console.log(adminPriviledge);
     
     try {
        const message = `You have admin priviledges, Go to this link ${adminPriviledge} to sign up your account, use ${email} as your email adddress and your assigned role is ${role}`;

        await sendEmail({
          email:req.body.email,
          subject:'You have admin priviledges in Bonavita',
          message
        })
     }
     catch(err)
     {
         next(err);
     }
     
    res.redirect('/adminRoles');
}



exports.getCompanyProfile = async(req,res,next)=> {
    const user = req.user;
   const company = await companyProfile.findOne();
    console.log(company);
    res.status(200).render('companyInfo',{company,user});
}

exports.comapanySaveChanges = async(req,res,next)=> {


    let logo = req.body.logo;
    let banner = req.body.banner;
    const companyName = req.body.companyName
    const emailAddress = req.body.emailAddress

    const Address = req.body.companyAddress;
    const lazadaUrl = req.body.lazadaUrl;
    const facebookUrl = req.body.facebookUrl;
    const instagramUrl = req.body.instagramUrl;
    const twiterUrl = req.body.twiterUrl;
   
    const TelNum = req.body.telNumber;
    const CpNum = req.body.contactNumber;

    const companyId = req.body.companyId;

    if(req.files.logo)
    {
        logo = req.files.logo[0].filename;

    }
    if(req.files.banner)
    {
        banner = req.files.banner[0].filename;
    }

    const updateProfile = await companyProfile.findByIdAndUpdate(companyId,{
        companyName,emailAddress,Address,lazadaUrl,facebookUrl,instagramUrl,twiterUrl,TelNum,CpNum,logo,banner
    });
    res.redirect('/adminCompanyProfile');
    
}
exports.getContactUs = async(req,res,next)=> {
   const profile = await companyProfile.findOne();
    res.status(200).render('contactus',{profile});
}
exports.getAboutUs = async(req,res,next)=> {
    res.status(200).render('aboutUs');
}
exports.getAcceptOrder = async(req,res,next)=> {
    const user =req.user;
    const eachCustomer = await customerTransactions.find({status: false});    
    res.status(200).render('adminAcceptOrder',{eachCustomer,user});

}
exports.getTransactionRecord = async(req,res,next)=> {
    const user =req.user;
    let eachCustomer;
    const keyword = req.query.keyword;
    const transactionId = req.query.transactionId;
    if(transactionId) {
        const Transaction  =  await customerTransactions.findOne({_id:transactionId,status: true});
        console.log("Customer found by id");
        console.log(Transaction);
        return res.status(200).render('adminTransactionRecords',{Transaction,user});

    }
  
    if(keyword){
        eachCustomer = await customerTransactions.find({$or: [ 
            {name:keyword,status:true}, 
            {province:keyword,status:true},
            {City:keyword,status:true},
            {paymentMethod:keyword,status:true}
    
        ]});
        console.log("Got a query")
        console.log(eachCustomer);

        return res.status(200).render('adminTransactionRecords',{eachCustomer,user});
    }

    eachCustomer = await customerTransactions.find({status: true});
    res.status(200).render('adminTransactionRecords',{eachCustomer,user});
}

exports.Accept = async(req,res,next)=> {
    const transactUser =req.user;
    const transactionId = req.query.transactionId;
    

    const customer = await customerTransactions.findByIdAndUpdate(transactionId,{
        status:true
    });

    res.redirect('/acceptOrder');

}
exports.getTestimonals = async(req,res,next)=> {
    const testimonials = await testimonial.find();
    const profile = await companyProfile.findOne();

    res.status(200).render('testimonials',{testimonials,profile});

}
exports.getAdminTestimonial = async(req,res,next)=> {
    const user =req.user;
    const testimonials = await testimonial.find();
    res.status(200).render('adminTestimonials',{testimonials,user});
}
exports.postTestimonial = async(req,res,next)=> {
    
    const testimonialHeading = req.body.testimonialHeading;
    const testimonialBody = req.body.testimonialBody;
    const Author = req.body.authorName;
  
    const createdTestimonal = await testimonial.create({
        testimonialBody,testimonialHeading,Author
    });
  
    res.redirect('/adminTestimonials');
}

exports.adminLogout = async(req,res,next)=> {
    res.cookie('jwt','loggedout',{
        expires: new Date(Date.now()+10*1000),
        httpOnly:true
    });
    res.redirect('/adminLogin');
}

exports.restrictToMaster = async(req,res,next)=> {
    const user = req.user;
    if(user.role == 'master')
    {
        return next();
    
    }
    else {
        res.render('priviledgeError');
    }
    
}

exports.restrictToEditor = async(req,res,next)=> {
    const user = req.user;
    if(user.role == 'editor')
    {
        return next();
    
    }
    
    res.render('priviledgeError');
    
}

exports.restrictToEncoder = async(req,res,next)=> {
    const user = req.user;
    if(user.role == 'encoder')
    {
        return next();
    
    }
    res.render('priviledgeError');
    
}

exports.restrictToMasterAencoder = async(req,res,next)=> {
    const user = req.user;

    if(user.role == 'master' || user.role=="encoder")
    {
        return next();
    }
    
    res.render('priviledgeError');
}


exports.restrictToMasterAeditor = async(req,res,next)=> {
    const user = req.user;
    console.log(user.role);
    if(user.role == 'master' || user.role=="editor")
    {
        console.log("went here'")
        return next();
    }
   
        res.render('priviledgeError');
    
    
}

exports.onlyAdmin = async(req,res,next)=> {
    const user = req.user;

    if(user.role != 'customer')
    {
        return next();
    }
    res.render('noAdminPriviledge');

}

exports.cancelOrder = async(req,res,next)=> {

    const transactionId = req.query.transactionId;
   
    const transact = await customerTransactions.findById(transactionId);

    for(var i = 0; i < transact.products.length; i++)
    {
       const update = await Product.findOneAndUpdate({ProductName:transact.products[i].productName},{
        $inc: { ProductStock: transact.products[i].itemBought}
       });
       console.log(update);
    }
    const transactDelete = await customerTransactions.findByIdAndDelete(transactionId);
    res.redirect('/acceptOrder');
}

exports.myAddress = async(req,res,next)=> {
    const user =req.user;
   const address =  await Address.find({userId:user});
    res.render('myAddress',{user,address});
}

exports.addressSave = async(req,res,next)=> {
    const userId = req.query.userId;
    console.log(userId);
    await User.findByIdAndUpdate(userId,{
        Street:req.body.Street,
        homeAddress:req.body.homeAddress,
        Subdv:req.body.Subdv,
        Barangay:req.body.Barangay,
        City:req.body.City,
        postalCode:req.body.postalCode
    }) 

    res.redirect('/myAddress');
}

exports.secondaryAddress = async(req,res,next)=> {
    const addressId = req.query.addressId;
    const userId = req.user;

    if(addressId) {
        await Address.findByIdAndUpdate(addressId,
        {
            Street:req.body.Street,
            homeAddress:req.body.homeAddress,
            Subdv:req.body.Subdv,
            Barangay:req.body.Barangay,
            City:req.body.City,
            postalCode:req.body.postalCode,
            userId
        });
    }
    else {
        await Address.create({
            Street:req.body.Street,
            homeAddress:req.body.homeAddress,
            Subdv:req.body.Subdv,
            Barangay:req.body.Barangay,
            City:req.body.City,
            postalCode:req.body.postalCode,
            userId
        });
    }
    res.redirect('/myAddress');

}