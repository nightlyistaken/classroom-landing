// server.js

var TORPEDO = require('torpedo.js');
var nodemailer = require('nodemailer');
var path = require('path');
var { emailOptions } = require('./config/config');

function generateHTML(req) {
	var htmlTemplate = `
	<html>
    <h1>New Form Submission</h1>
    <p> Name: ${req.body.name},</p>
    <p> Message: ${req.body.message} </p>
    <p> Email: ${req.body.email} </p>
	</html>
    `
    return htmlTemplate
}

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: emailOptions
});

var { post, get } = new TORPEDO({
	name: 'Classroom',
	publicDir: '.'
});

get('/thanks').sendFile(path.join(__dirname, './thankyou.html'));

post('/send').do(function(req, res) {
  // send email from here
  transporter.sendMail({
    from: emailOptions.user, // sender address
    to: emailOptions.user, // list of receivers
    subject: 'Classroom Contact!', // Subject line
    html: generateHTML(req)
  }, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
 	 res.redirect('/thanks')
    });
})