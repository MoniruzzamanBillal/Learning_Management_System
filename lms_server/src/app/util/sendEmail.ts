import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (
  resetPasswordLink: string,
  receiverMail: string
) => {
  const transporter = nodemailer.createTransport({
    host: config.nodemailer_host,
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.nodemailer_sender,
      pass: config.nodemailer_password,
    },
  });

  const response = await transporter.sendMail({
    from: config.nodemailer_sender, // sender address
    to: receiverMail, // list of receivers
    subject: "Reset your password within 5 mins!",
    text: "", // plain text body
    html: resetPasswordLink,
  });

  return response;
};
