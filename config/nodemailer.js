const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS
    },
    family: 4
});

transporter.verify((err) => {
    if (err) console.error(err);
    else console.log("Mail server ready");
});

module.exports = transporter;