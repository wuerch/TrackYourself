const nodemailer = require('nodemailer');

function userDataEmail(email, user){
    
        
            const GOOGLE_SMTP_EMAIL = process.env.GOOGLE_SMTP_EMAIL
            const GOOGLE_SMTP_PW = process.env.GOOGLE_SMTP_PW
        
            // create a transporter object using your desired transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: GOOGLE_SMTP_EMAIL,
                    pass: GOOGLE_SMTP_PW
                }
            });
        
            // define the email options
            let mailOptions = {
                from: '"Workout Tracker" <your-email@example.com>',
                to: email,
                subject: `Your Data`,
                html: `<pre >${JSON.stringify(user, undefined, 2)}</pre>`
            };
        
            // send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json({status:200})
                    // console.log(`Email sent: ${info.response}`);
                }
            });


}
module.exports = {userDataEmail}