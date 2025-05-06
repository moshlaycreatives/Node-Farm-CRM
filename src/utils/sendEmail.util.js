import nodemailer from "nodemailer";
import { InternalServerErrorException } from "../errors/index.js";

export const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: `${process.env.FROM} <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw new InternalServerErrorException(
      "Something went wrong while sending email.",
      error
    );
  }
};
