var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qmshao02@gmail.com',
    pass: 'whipqq17'
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