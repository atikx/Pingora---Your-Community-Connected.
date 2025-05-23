import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export const sendOtpMail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "atikshg69@gmail.com",
      pass: "rbpiogihnrinwpvc",
    },
  });

  const htmlTemplate = fs
    .readFileSync("./template/otp-email.html", "utf-8")
    .replace("{{OTP}}", otp);

  const mailOptions = {
    from: `"OTP Service" <${process.env.MAIL_USER}>`,
    to,
    subject: "PINGORA OTP Code",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP sent to ${to}`);
};

export const sendRequestMailForAdminToMe = async (name, email, reason) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "atikshg69@gmail.com",
      pass: "rbpiogihnrinwpvc",
    },
  });

  const htmlTemplate = fs
    .readFileSync("./template/admin-req.html", "utf-8")
    .replace("{{NAME}}", name)
    .replace("{{EMAIL}}", email)
    .replace("{{REASON}}", reason);

  const mailOptions = {
    from: `"OTP Service" <${process.env.MAIL_USER}>`,
    to: "atikshgupta6373@gmail.com",
    subject: "Request to become admin",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Request to become admin sent `);
};
