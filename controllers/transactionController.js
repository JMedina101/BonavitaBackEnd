const Shipping = require('./../models/shippingModels');
const Product = require('./../models/productModels');
const companyProfile = require('./../models/companyProfileModels');
const { compareSync } = require('bcrypt');
const User =require('./../models/userModel');
const Address = require('./../models/Addresses');


exports.cart = async(req,res,next)=> {
    const profile = await companyProfile.findOne();
    const user = res.locals;

    res.status(200).render('cart',{profile,user});
}

exports.checkout = async(req,res,next)=> {
    const user = req.user;
    const productId = req.query.productId;
    const quantityBought = req.query.productQuantity;
   
    const product =await  Product.findById(productId);
    const price = parseFloat(quantityBought*product.ProductPrice);
    const TotalPrice = Math.round(price * 100) / 100;

    const shipping = await Shipping.find();
    console.log(shipping);

    res.status(200).render('checkoutFinal',{
        user,shipping,product,quantityBought,TotalPrice
    });
}
exports.summary = async(req,res,next)=> {
    res.status(200).render('success');
}

exports.getOrderSummary = async(req,res,next)=> {
    res.status(200).render('orderSummary');
}

exports.postOrderSummary = async(req,res,next)=> {
    const user =req.user;
    const profile = await companyProfile.findOne();

    const shippingLoc = req.body.shippingLoc;
    
    var homeAddress = req.body.homeAddress;
    const provinceLocation = req.body.provinceLocation;
    var city = req.body.city;
    var Barangay = req.body.Barangay;
    var postalCode = req.body.postalCode;
    const modeOfPayment = req.body.modeOfPayment;
    var streetName = req.body.streetName;
    var subdv = req.body.subdv;
   
    const totalPrice = req.body.totalPrice;

    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const notes = req.body.notes;
    
    const shipping = await Shipping.findOne({
        location:provinceLocation
    });

    const shippingPrice = shipping.price;
   
    const quantity = req.body.itemQuantity;
    const product = req.body.productId;
    const productPrice = req.body.productPrice;

    let arrayProduct = [];

    const parseTotal = parseFloat(totalPrice);
    const parseShipping = parseFloat(shippingPrice);
    const subTotal = parseTotal+ parseShipping;
    const roundedSubTotal = Math.round(subTotal * 100) / 100;
    for( var i = 0; i < quantity.val.length; i++)
    {
        const foundProduct = await Product.findById(product.val[i]);
        arrayProduct.push(foundProduct);
    }
    
    
    if(shippingLoc !== "other") {
        const ending = parseInt(shippingLoc.toString().slice(-1));
        
        homeAddress = req.body.predHomeAddress.val[ending-1];
        city = req.body.predCity.val[ending-1];
        streetName =  req.body.predStreet.val[ending-1];
        subdv =  req.body.predSubdv.val[ending-1];
        Barangay = req.body.predBarangay.val[ending-1];
        postalCode = req.body.predPostalCode.val[ending-1];
    }
        res.status(200).render('orderSummary',{
            provinceLocation,city,Barangay,postalCode,modeOfPayment,notes,homeAddress,streetName,subdv,shippingPrice,totalPrice,name,phoneNumber,notes,productPrice,arrayProduct,quantity,roundedSubTotal,profile
         });
    
}

exports.displayCheckout = async(req,res,next)=> {
    const user = req.user;
    const shipping = await Shipping.find();
    const error = "Invalid number of items";
    const profile = await companyProfile.findOne();
    const quantity = req.body.itemQuantity;
    const product = req.body.product;
    let arrayProduct = [];
    let arrayQuantity = [];
    let productPrice = [];
    let total = 0;
    let indicator = false;



    for( var i = 0; i < quantity.val.length; i++)
    {
        const foundProduct = await Product.findOne({ProductName:product.val[i]});
        arrayProduct.push(foundProduct);
        arrayQuantity.push(quantity.val[i]);
        productPrice.push(arrayProduct[i].ProductPrice*arrayQuantity[i]);
    }

    console.log(productPrice);


    for(var i = 0; i < arrayProduct.length; i++)
    {
        console.log(arrayProduct[i].ProductStock);
        console.log("Item bought ");
        console.log(quantity.val[i]);


        if(arrayProduct[i].ProductStock >= quantity.val[i])
        {
            indicator = true;
        }
        else {
            indicator = false;
            break;
        }
    }
    for (var i = 0;  i < productPrice.length; i++)
    {
        total+=productPrice[i];

    }

    const roundedSubTotal = Math.round(total * 100) / 100;

    const userShipping = await User.findById(user);
    const address = await Address.find({userId:user});
    console.log(address);

    if(indicator === true)
    {
        res.status(200).render('checkoutFinal',{
            user,shipping,arrayProduct,arrayQuantity,productPrice,roundedSubTotal,profile,userShipping,address
        });
    }
    else {
       res.status(200).render('cart',{error,profile});
    }

}