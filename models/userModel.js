const mongoose = require('mongoose');
const bcrypt     = require('bcrypt');
const crypto   = require('crypto');
const customerSchema = new mongoose.Schema({
    customerId: {
        type:mongoose.Schema.ObjectId
    },
    name: {
        type:String,
        required:[true,'Must have a name']
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
        minlength:6,
        select:false,
    
    },
      role: {
          type:String,
          enum:['customer','master','editor','encoder'],
          default:"customer"
      }
    ,
    confirmPassword: {
        type:String,
        required:true,
        validate: {
            // This validator only works on CREATE and SAVE!!!
            validator:function(el){
                return el === this.password;
            },
            message: "Password are not the same!"
        }
    },
    phoneNumber: {
        type:Number,
        maxlength:11
    },
    homeAddress: {
        type:String,
        required:true
    },
    Street: {
            type:String,
            required:false
    },
    Subdv: {
            type:String,
            required:true
    },
    Barangay: {
            type:String,
            required:true
    },
    City: {
            type:String,
            required:true
    },
    postalCode: {
            type:String,
            required:true
    },
    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active: {
        type:Boolean,
        default:true,
        select:false
    }
});
customerSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.confirmPassword = undefined;
    next();
  });
  customerSchema.pre('save',function(next){
        if(!this.isModified('password')|| this.isNew) return next();

        this.passwordChangedAt = Date.now()-1000;
        next();
  });
  customerSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
  });

  customerSchema.methods.correctPassword = async function(candidatePassword,userPassword){
      try {
        return await bcrypt.compare(candidatePassword,userPassword);
      }
      catch(err) {
          console.log(err);
      }
    
  }
  customerSchema.methods.changedPasswordAfter = async function(JWTTimestamp) {
      if(this.passwordChangedAt) {
        //   ang logic neto if yung time stamp ng changedTimeStamp is mas malaki doon sa JWTTimes stamp ibig sabihin nagadjust ka or nag change password siya after ng jwt session
          const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime()/1000,10
          );
          console.log("Changed Time stamp value "+changedTimeStamp+"  VS JWT Time stamp"+JWTTimestamp);
          return JWTTimestamp < changedTimeStamp;
      }
      return false;
  }

  customerSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
  const customer = mongoose.model('User', customerSchema);
  module.exports =customer;
