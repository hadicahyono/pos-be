const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yayahaha0110@gmail.com",
    pass: "uvglkmxbursrwlgl",
  },
});

module.exports = {
  transport,
};
