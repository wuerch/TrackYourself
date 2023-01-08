function sendEmail(recipient, link){

    const nodemailer = require("nodemailer")
    require('dotenv').config()

    const email = `${process.env.GOOGLE_SMTP_EMAIL}`
    const pw = `${process.env.GOOGLE_SMTP_PW}`

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: email,
            pass: pw
        }
    })

    let details = {
        from: email,
        to: recipient,
        subject: "Aktivierungslink",
        text: `Klick auf den Link um deinen Account zu aktivieren: ${link}`
    }
    transporter.sendMail(details, (err, result)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Email sended")
        }
    })

}
module.exports = {sendEmail}
