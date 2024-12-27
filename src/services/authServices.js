import createHttpError from "http-errors";
import { User } from "../db/models/user.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { Session } from "../db/models/session.js";
import { TWENTY_MINUTES, TWENTY_DAY } from "../constants/constants.js";

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
