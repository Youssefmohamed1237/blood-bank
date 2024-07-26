const { text } = require("express");
const nodemailer = require("nodemailer");
const sendEmail = async (option) => {
  const transportar = nodemailer.createTransport({
    port: process.env.EMAIL_PORT,
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailoption = {
    from: "youssef mohamed <youssef@mail.com>",
    to: option.to,
    subject: option.subject,
    text: option.message,
  };
  await transportar.sendMail(mailoption);
};
module.exports = sendEmail;
