import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export const sendOtpMail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
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
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
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

export const sendNewPostMail = async (bccList, post) => {
  /**
   * bccList: string[] - list of email addresses to receive the mail (in BCC)
   * post: {
   *   author_name: string,
   *   author_avatar: string,
   *   post_link: string,
   *   post_image: string,
   *   post_title: string,
   *   post_description: string,
   *   post_created_at: string
   * }
   */

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  let htmlTemplate = fs.readFileSync("./template/newPostNotification.html", "utf-8");

  htmlTemplate = htmlTemplate
    .replace(/{{author_name}}/g, post.author_name)
    .replace(/{{author_avatar}}/g, post.author_avatar)
    .replace(/{{post_link}}/g, post.post_link)
    .replace(/{{post_image}}/g, post.post_image)
    .replace(/{{post_title}}/g, post.post_title)
    .replace(/{{post_description}}/g, post.post_description)
    .replace(/{{post_created_at}}/g, post.post_created_at);

  const mailOptions = {
    from: `"New Post Notification" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER, // to avoid Gmail errors (must include at least one visible recipient)
    bcc: bccList, // list of recipients
    subject: `New post by ${post.author_name}: ${post.post_title}`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
  console.log(`New post notification sent to ${bccList.length} users`);
};
