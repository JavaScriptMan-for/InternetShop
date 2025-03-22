
const {createTransport} = require('nodemailer')



const my_email = process.env.MY_EMAIL
const pass = process.env.PASS; 

const transporter = createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: my_email,
    pass: pass,
  },
});
module.exports = transporter