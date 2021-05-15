
const {promisify} = require('util');
const User = require('./../models/userModel');
const jwt  = require('jsonwebtoken');
const { findOne } = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const adminRole = require('./../models/adminRoles');
const company = require('./../models/companyProfileModels');
const address = require('./../models/Addresses');

// code for signing in 
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };

  const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    // res.status(statusCode).json({
    //   status: 'success',
    //   token,
    //   data: {
    //     user
    //   }
    // });
  };

exports.customerSignUp = async(req,res,next)=>{
  
        //listing messages in users mailbox 
        // baguhin mo to for security reason

        // const token = jwt.sign({id:newCustomer._id},process.env.JWT_SECRET,{
        //     expiresIn:process.env.JWT_EXPIRES_IN
        // });
      
        let errHandler;
        const newCustomer = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword,
            phoneNumber:req.body.phoneNumber,
            Street:req.body.Street,
            homeAddress:req.body.homeAddress,
            Subdv:req.body.Subdv,
            Barangay:req.body.Barangay,
            City:req.body.City,
            postalCode:req.body.postalCode
            },(err,value)=>{
            if(err)
            {

                if (err.name === 'MongoError' && err.code === 11000) {
                    // Duplicate username

                    errHandler = "Email already exist";
                }
                else if (err.name === 'ValidationError')
                {
                   errHandler = "Password did not match or did not meet the minimum requirement length of atleast 6 characters"
                }
            
                return res.redirect('/signUp?error=' + errHandler);
            }

            createSendToken(value, 201, res);
            return res.redirect('/login');
            
        });      
       
    
     
}

exports.login = async(req,res,next)=> {
    // destructuring 
    const {email,password} = req.body;
    let error;
    // 1.) Check if email and password actually exist
    if(!email || !password) {
        
        error = "Please provide email or password";
       
        return res.redirect('/login?error=' + error);
    }

    // 2.) Check if customer exists and if password is actually correct
    let user;
    try{
         user = await User.findOne({email}).select('+password');
    }
    catch(err) {
        next(err);
    }

    //3.) checking if the user password from the databse is correct with the inputted value from the post request, then this correctPassword() can be found in userModel
    
    //  if the username is empty
    try {
        if(!user || !(await user.correctPassword(password,user.password))) {
            error = "Invalid email or password";
            return res.redirect('/login?error=' + error);
        }
    }
    catch(err) {
        next(err);
    }
       // If everyhting is ayt do this
    createSendToken(user, 200, res);
    res.redirect('/');
    // next()
   
}

exports.logout = (req,res)=> {
    res.cookie('jwt','loggedout',{
        expires: new Date(Date.now()+10*1000),
        httpOnly:true
    });
    res.redirect('/login');
}
// This route is made for protected routes
exports.protectRoutes = async(req,res,next)=> {
    let token;
  
    //1.)  Getting the token and check if it's available
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
        {
            token = req.headers.authorization.split(' ')[1];
        }  
        else if (req.cookies.jwt) {
            token  = req.cookies.jwt;
        }
        if(!token) 
        {
            return  res.status(200).render('errorProtected');
        }
    //2.)   verify if the token is valid
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    }
    catch(err) {
        const error = "Invalid token";
        return next(res.status(500).json({
            status:"fail",
            error
        }));;
    }
    // Check if the user exist
    let freshUser;
    try {
        freshUser  = await(User.findById(decoded.id));
        if(!freshUser) {
            return next(res.status(500).json({
            status:"fail",
            error:"The user is not associated with the said token"
            
        }));
        }
    }
    catch(err) {
    
         return next(res.status(500).json({
            status:"fail",
            error:"User with that token is not available anymore"
        }));
    }
    // 4.) Check if user changed password after the token was issued
    // not yet working go to lecture 131
    // if(freshUser.changedPasswordAfter(decoded.iat)) {
    //     return next(res.status(500).json({
    //         status:"fail",
    //         error:"User recently updated his/her own credentials.. Login again"
    //     }));
    // }
    // after all the credential checking then will go to the protected route
    // the value of the req.user will be updated to the newely created fresh user
    req.user = freshUser;
    // yung ginamit mo dito na req.user = freshUser is yung ginamit sa restrictTo 
    next();
}

// ... roles is a closure
exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        // roles can be ['customer','master','editors','encoders']
        if(!roles.includes(req.user.role)) {

            return next(res.status(404).json({
                staus:"error",
                message:"You have an invalid user role you should not be here"
            }));
        }
        res.status(200).json({
            staus:"success",
            message:"Valid role"
        });
        next();
    }
}

exports.forgotPassword = async(req,res,next) => {
    try {
      const user = await User.findOne({email:req.body.email});
      console.log(user);
      if(!user) {
        
        return next(res.status(200).json({
            status:"Fail",
            message:"Not working"
        }));
      }
      
      const resetToken = user.createPasswordResetToken();
      try {
        await user.save({validateBeforeSave:false});
       
    }
    catch(err) {
        next(err)
    }
    const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/resetPassword/${resetToken}`;
      console.log(resetURL);
     
     try {
        const message = `Forgot your password? Go to this link ${resetURL} to update your password credentials.\nIf you didn't forget your password, please ignore this email!`;
        await sendEmail({
          email:req.body.email,
          subject:'Your password reset token (valid for only 10 mins)',
          message
        })
        res.status(200).json({
          status:"Email successfully sent",
          message:"Token sent to email!"});
        next();
     }
     catch(er)
     {
         console.log(er);
         user.passwordResetToken = undefined;
         user.passwordResetExpires = undefined;
         await user.save({validateBeforeSave:false});

        return next(er);
     }
     
    }

    catch(err)
    {
        next(err);
    }
  
  }
exports.resetPassword = async (req,res,next)=> {
    // 1.) get user based on the given token from the path
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
      // 2.) If token is not yet expire then accept the token and user exist
    let user;
    try {
       user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpires: { $gt: Date.now() }});
        console.log(user);
        if(!user) {
            return next(res.status(404).json({
                status:"Fail",
                message:"Invalid token or the token expired"
                
            }));

        }
    }
    catch(err) {
        return next(err);
    }
  

    // 3.) Update the changePassword property for the user
    console.log(req.body.password);
    console.log(req.body.confirmPassword);
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    await user.save();
    createSendToken(user, 200, res);
    return next();
    // 4.) log the user in, send jwt
}


exports.updatePassword =async(req,res,next)=> {
    // BUG: Kailangan alive yung token hagnang di pa validated

    // get the specific user from the collection
    
    // check if the POSTed request from the client is correct

    // 3.) If so, update the password

    // 4.) Log in the user after
    let user;
    try {
        user = await User.findById(req.user.id).select('+password');
    }
    catch(err) {
        return next(err);
    }
    try {
       
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
             return next(res.status(500).json({
                 status:"Fail",
                 Message:"Password mismatch"
               }));

        }
        
    }
    catch(err) {
        return next(err);
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createSendToken(user, 200, res);
    return next();
}


exports.showFormLogin = async(req,res,next)=> {
    const error = req.query.error;

    res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    ).render('login',{error});
}
exports.showFormSignUp = async(req,res,next)=> {
    const error = req.query.error;

    return res.status(200).render('signup',{error});
}
exports.showForgotPasswordForm = async(req,res,next)=> {
    res.status(200).render('forgotPassword');
}

exports.isLoggedIn = async(req,res,next)=> {
    if(!req.cookies)
    {
        res.locals = null;
        return next();

    }
    if(req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );
            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if(currentUser) {
                res.locals = currentUser;
                return next();
            }
            else {
                console.log("not exisiting");
                return next();
            }
        }
        catch(err)
        {
            next(err);
        }
        }
        else{
            res.locals = null;
            return next();
        }
   
   
}
exports.saveChangesUser = async (req,res,next)=> {
    const userId = req.query.id;
    const role = req.query.role;

    const name = req.body.username;
    const email  = req.body.email;
    const phoneNumber = req.body.phonenum;

    const user = await User.findByIdAndUpdate(userId,{

         name,email,phoneNumber
     });
    if(role)
    {
        return res.redirect('/adminProfile');
    }
    res.redirect('/userProfile');
}
exports.getResetPage = async (req,res,next)=> {
    res.status(200).render('resetPassword');
}

exports.updateMyPassword = async(req,res,next) => {
    let user;
    currUser= req.user;
    const role =req.query.role;
    let error = "";

    const profile = await company.findOne();
    try {
        user = await User.findById(currUser.id).select('+password');
    }
    catch(err) {
        return next(err);
    }
    console.log(user.password);

    try {
        if (!(await user.correctPassword(req.body.currPassword,user.password))) {
            error = "Incorrect old password! Try again!";
            if(currUser.role === 'customer') {
                createSendToken(user, 200, res);
                return res.redirect("/userProfile?error="+error);
            }
            else {
                createSendToken(user, 200, res);
                return res.redirect("/adminProfile?error="+error);
            }
          
        }
        
    }
    catch(err) {

    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    await user.save()
    .then((user) => {
        // If everything goes as planed
        //use the retured user document for something
        
        if(currUser.role === 'customer')
        {
            createSendToken(user, 200, res);
            return res.redirect("/userProfile");
            
        }
        else {
            createSendToken(user, 200, res);
            return res.redirect("/adminProfile");
        }
    })
    .catch((err) => {
        //When there are errors We handle them here
        error= "Password Mismatch";
        if(currUser.role === 'customer') {
            return res.redirect('/userProfile?error='+error);
        }
        else {
            return res.redirect('/adminProfile?error='+error);
        }
    });
    
}

exports.getAdminLogin = async(req,res,next)=> {
    const error = req.query.error;
    res.status(200).render('adminLogin',{error});
}

exports.getAdminSignUp = async(req,res,next)=> {
    const error = req.query.error;

    res.status(200).render('adminSignUp',{error});
}

exports.adminSignUp = async(req,res,next)=> {
    
    const email = req.body.email;
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const adminUser = await adminRole.findOne({email});
    let error;
    

    if(adminUser)
    {
        const role = adminUser.role;
        // continue mo na lagn next time
            let user = await User.create({email,name,phoneNumber,password,confirmPassword,role},(err,value)=> {
            if(err)
            {

                if (err.name === 'MongoError' && err.code === 11000) {
                    // Duplicate username

                    error = "Email already exist";
                }
                else if (err.name === 'ValidationError')
                {
                   error = "Password did not match or did not meet the minimum requirement length of atleast 6 characters"
                }
            
                return res.redirect('/adminSignUp?error=' + error);
            }
            
            createSendToken(value, 201, res);
            return  res.redirect('/adminLogin'); 
        });
        
    }
    
    else
    {
         error = "You do not have admin Prviliedges"
         return res.redirect('/adminSignUp?error='+error);
    }
    
    

   
    
}
exports.adminLogin = async(req,res,next)=> {
    // dapat strictly admin lang pwede, try implementing
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({email}).select('+password');
    let error;
    const isValid = await adminRole.findOne({email});
    if(!email || !password)
    {
        error ="Must have email or password";
        return res.redirect('/adminLogin?error='+error);

    }
    if(isValid)
    {
        if(!user || !(await user.correctPassword(password,user.password))) {
            error ="error Invalid email or password";
            return res.redirect('/adminLogin?error='+error);
        }
    }
    else {
        error = "You do not have admin Prviliedges"

        return res.redirect('/adminLogin?error='+error);
    }
    createSendToken(user, 200, res);
    res.redirect('/welcome');
}

exports.getAdminProfile = async(req,res,next)=> {
    const user = req.user;
    const error =req.query.error;

    res.status(200).render('adminProfile',{user,error});

}

exports.getAdminLogout = async(req,res,next)=> {
   res.redirect('/adminLogin');
}


