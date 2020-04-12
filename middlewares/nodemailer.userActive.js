const nodemailer = require("nodemailer");
// req: email , subject and content
module.exports = function (email, subject, content) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "login", // default
      user: "pinkfoxstoredemo@gmail.com",
      pass: "thien123",
    },
  });

  const mailOptions = {
    from: "pinkfoxstoredemo@gmail.com",
    to: email,
    subject: subject,
    html: content,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};
