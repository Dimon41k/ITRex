var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
 host: 'smtp.ukr.net',
 port: 465,
 secure: true,
 auth: {
        user: 'madi.nickname@ukr.net',
        pass: '******'
    }
});


export default transporter;
/*const mailOptions = {
  from: 'madi.nickname@ukr.net', // sender address
  to: 'madi.nickname@gmail.com', // list of receivers
  subject: 'Subject of your email', // Subject line
  html: '<p>Your html here</p>'// plain text body
};
transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
});*/
