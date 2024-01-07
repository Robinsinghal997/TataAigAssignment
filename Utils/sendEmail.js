
const nodemailer = require('nodemailer')

const sendemail =async (option)=>{

    const transpot = nodemailer.createTransport({
        host: process.env.SMPT_SERVICES,
        port: 465,
        secure: true,  // true for 465, false for other ports
        auth: {
          user: process.env.SMPT_MAIL, // generated ethereal user
          pass: process.env.SMPT_PASSWORD, // generated ethereal password
        },
      })
      const mailoptions = {
        form:process.env.SMPT_MAIL,
        to: option.email,
        subject:option.subject,
        text:option.message
      }
      await transpot.sendMail(mailoptions)
}
module.exports = sendemail