import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import * as fs from "fs/promises";
import handlebars from "handlebars";

import { env } from "../utils/env.js";
import { sendUserEmail } from "../utils/sendUserEmail.js";
import { User } from "../db/models/user.js";
import { randomBytes } from "crypto";
import { Session } from "../db/models/session.js";
import {
  TWENTY_MINUTES,
  TWENTY_DAY,
  SMTP,
  TEMPLATE_DIR,
} from "../constants/constants.js";

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw createHttpError(409, "Email використовується!");
  const bcryptsPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, password: bcryptsPassword });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user)
    throw createHttpError(
      401,
      "Помилка автентифікації. Будь ласка, перевірте свої облікові дані.",
    );
  const isPasswordUser = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordUser)
    throw createHttpError(
      401,
      "Помилка автентифікації. Будь ласка, перевірте свої облікові дані.",
    );
  await Session.deleteOne({ userId: user._id });
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + TWENTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + TWENTY_DAY),
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + TWENTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + TWENTY_DAY),
  };
};

export const refreshSessionUser = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken: refreshToken,
  });

  if (!session) throw createHttpError(401, "Сессію не знайдено!");

  const isSesionTokenEnd =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSesionTokenEnd)
    throw createHttpError(401, "Термін дії токена закінчився");

  const newSession = createSession();
  await Session.deleteOne({ _id: sessionId, refreshToken: refreshToken });
  return await Session.create({ userId: session.userId, ...newSession });
};

export const logoutUser = async (sessionId, refreshToken) => {
  await Session.deleteOne({ _id: sessionId, refreshToken: refreshToken });
};

export const reqResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, "Користувача не знайдено");
  const resetToken = jwt.sign({ sub: user._id, email }, env("JWT_SECRET"), {
    expiresIn: "10m",
  });

  const resetPasswordTemplate = path.join(
    TEMPLATE_DIR,
    "reset-password-email.html",
  );

  const templateBasis = (await fs.readFile(resetPasswordTemplate)).toString();
  const basis = handlebars.compile(templateBasis);
  const html = basis({
    name: user.name,
    link: `${env("APP_DOMAIN")}/reset-password?token=${resetToken}`,
  });
  await sendUserEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: "Перезавантажити ваш пароль",
    html,
  });
};

export const resetPassword = async (payload) => {
  let data;
  try {
    data = jwt.verify(payload.token, env("JWT_SECRET"));
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(401, "Токен прострочений або недійсний");
    throw error;
  }

  const user = await User.findOne({ email: data.email, _id: data.sub });
  if (!user) throw createHttpError(404, "Користувача не знайдено");
  const codedPass = await bcrypt.hash(payload.password, 10);
  await User.updateOne({ _id: user._id }, { password: codedPass });

  const sessionUser = await Session.findOne({ userId: user._id });
  if (sessionUser) {
    await Session.deleteOne({ userId: user._id });
  }
};
