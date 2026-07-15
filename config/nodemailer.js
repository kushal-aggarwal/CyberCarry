const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS
    }
});

transporter.verify((err, success) => {
    if (err) {
        console.error("MAIL VERIFY ERROR:", err);
    } else {
        console.log("Mail server ready");
    }
});

module.exports = transporter;