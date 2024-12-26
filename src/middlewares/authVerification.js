import createHttpError from "http-errors";
import { Session } from "../db/models/session.js";
import { User } from "../db/models/userModel.js";

export const authVerification = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    next(createHttpError(401, "Відсутній заголовок авторизації"));
    return;
  }
  const authBearer = authHeader.split(" ")[0];
  const authToken = authHeader.split(" ")[1];
  if (authBearer !== "Bearer" || !authToken) {
    next(createHttpError(401, "Авторський заголовок повинен мати тип Bearer"));
    return;
  }
  const session = await Session.findOne({ accessToken: authToken });
  if (!session) {
    next(createHttpError(401, "Сессія не знайдена"));
    return;
  }

  const isAccessTokenEnd = new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenEnd) {
    next(createHttpError(401, "Термін дії токену закінчився"));
    return;
  }
  const user = await User.findById(session.userId);
  if (!user) {
    next(createHttpError(401, "Користувача не знайдено"));
    return;
  }
  req.user = user;
  next();
};
