import createHttpError from "http-errors";
import { TWENTY_DAY } from "../constants/constants.js";
import {
  loginUser,
  logoutUser,
  refreshSessionUser,
  registerUser,
} from "../services/authServices.js";

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 200,
    message: "Успішно зареєстрований користувач",
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + TWENTY_DAY),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + TWENTY_DAY),
  });
  res.status(200).json({
    status: 200,
    message: "Успішно зареєстровано користувача!",
    data: { accessToken: session.accessToken },
  });
};

const setSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + TWENTY_DAY),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + TWENTY_DAY),
  });
};

export const refreshSessionController = async (req, res) => {
  const session = await refreshSessionUser({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  setSession(res, session);
  res.status(200).json({
    status: 200,
    message: "Успішно відновлено сессію",
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  if (!sessionId && !refreshToken)
    throw createHttpError(401, "Сессія не знайдена!");
  await logoutUser(sessionId, refreshToken);
  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).end();
};
