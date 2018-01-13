var nodemailer = require('nodemailer');
const fs = require("fs");

fileContent = fs.readFileSync('./data/password.json', "utf8");//
const password = JSON.parse(fileContent).password;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qmshao02@gmail.com',
    pass: password
  }
});

var mailOptions = {
  from: 'qmshao02@gmail.com',
  to: 'qmshao@gmail.com,qmshao@me.com',
  subject: 'Your Miner is Resting',
  text: 'Get back to work!!!!!!'
};


module.exports = function(){
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}