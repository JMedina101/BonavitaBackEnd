
const User = require('./../models/userModel');

const filterObj = (obj,...allowedFields)=> {
    
    const newObj= {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el))
        {
            newObj[el] = obj[el];

        }
    });
    return newObj;

}
exports.showAllUser = async(req,res,next)=> {
    try {
        const allUser = await User.find();
         res.status(201).json({
             status:"success",
             allUser
        });
    }
    catch(err) {
         next(err);
    }
} 

exports.updateMe = async(req,res,next)=> {
    // 1.) Error if user  POST his password data
   try {

    if(req.body.password || req.body.confirmPassword) 
    {
        return next(res.status(500).json({
            status:"fail",
            message:"Invalid update. This url is not for password updates!"
        }));
    }
   }
   catch(err) {

     next(err);
   }
    // 2.) If not just update the user document
   const filteredBody = filterObj(req.body,'name','email');
   let user;
//    Use findByIdAndUpdate if yung uupdate mo hindi need yung validators
    try {
        user = await User.findByIdAndUpdate(req.user.id,filteredBody,{
            new:true,
            runValidators:true
        });
    

    }
    catch(err) {
        next(err);
    }
   
    if(!user) {

        return next(res.status(404).json({
            status:"Fail",
            message:"Invalid sesssion"

        }));

    }
   res.status(201).json({
    status:"Pass",
        user
    });
     next();
}
exports.deleteMe = async(req,res,next)=> {
    await User.findByIdAndUpdate(req.user.id,{active:false});

    res.status(204).json({
        status:"success",
        message:"user successfully hidden"
    });

}


