const nodemailer = require('nodemailer');

const sendEmail =async options => {
    // 1.) Create a transporter
   
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            auth: {
                user:process.env.EMAIl_USERNAME,
                pass:process.env.EMAIl_PASSWORD
            },
            tls:{
                rejectUnauthorized:false
            }
            // Activate in gmail "less secure app" option
        });
        // 2.) Define the email options
       const mailOptions = {
            from:'Jose Miguel Medina <josemiguel.medina.iics@ust.edu.ph>',
            to:options.email,
            subject:options.subject,
            text:options.message,
            // html:
        }
        await transporter.sendMail(mailOptions)
    }
    catch(e) {
        console.log(e);
    }
   
    // 3.) Send the email with nodemailer
   
}
module.exports =sendEmail;