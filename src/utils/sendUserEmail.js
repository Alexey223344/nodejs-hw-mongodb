import nodemeiler from "nodemailer";
import { env } from "./env.js";
import { SMTP } from "../constants/constants.js";
import createHttpError from "http-errors";

const transporter = nodemeiler.createTransport({
  host: env(SMTP.SMTP_HOST),
  poer: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendUserEmail = async (options) => {
  const email = await transporter.sendMail(options);
  if (email.rejected.length !== 0)
    throw createHttpError(
      500,
      "Не вдалося відправити імейл, будь ласка, спробуйте пізніше.",
    );
};
