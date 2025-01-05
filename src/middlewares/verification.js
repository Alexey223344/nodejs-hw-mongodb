import createHttpError from "http-errors";
import { Session } from "../db/models/session.js";
import { User } from "../db/models/user.js";

export const verification = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    next(createHttpError(401, "The authorization header is missing"));
    return;
  }
  const authBearer = authHeader.split(" ")[0];
  const authToken = authHeader.split(" ")[1];
  if (authBearer !== "Bearer" || !authToken) {
    next(createHttpError(401, "Auth header should be of type Bearer"));
    return;
  }
  const session = await Session.findOne({ accessToken: authToken });
  if (!session) {
    next(createHttpError(401, "Session not found"));
    return;
  }

  const isAccessTokenEnd = new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenEnd) {
    next(createHttpError(401, "Access token expired"));
    return;
  }
  const user = await User.findById(session.userId);
  if (!user) {
    next(createHttpError(401, "User not found"));
    return;
  }
  req.user = user;
  next();
};
