import createHttpError from "http-errors";
import { ALL_ROLES } from "../constants/constants.js";

export const roles = (...roles) => {
  return async (req, res, next) => {
    const { user } = req;
    if (!user) {
      next(createHttpError(401, "Користувача не знайдено"));
      return;
    }
    const { role } = user;
    if (roles.includes(ALL_ROLES.ADMIN) && role === ALL_ROLES.ADMIN) {
      next();
      return;
    }
    if (roles.includes(ALL_ROLES.USER) && role === ALL_ROLES.USER) {
      next();
      return;
    }
    next(createHttpError(403));
  };
};
