const nodemailer = require('nodemailer');
const email="berrytern@gmail.com"
const gmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'easyfireforceroute@gmail.com',
      pass: 'force4321',
    }
  });
const randomCode=async({email,code,socketid})=>{
    gmailOptions = {
        from: 'easyfireforceroute@gmail.com',
        to: `${email}`,
        subject: 'Authentication',
        html: `<html><body>Account validation<br/>Was you? <a href="http://localhost:4000/verify?code=${code}&email=${email}&id=${socketid}">yes</a>
                </body></body></html>`
    };
    return await send(gmailOptions).then(i=>{console.log(i)}).catch(e=>{console.log(e)})
}
const send=async(json)=>gmail.sendMail(json, function(error, info){
if (error) {
    console.log('inside send: ',error);
} else {
    console.log('Email sent: ' + info.response);
}
});

const activate =(email,code)=>{
  
}
module.exports = {randomCode}