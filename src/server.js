import express from "express";
import cors from "cors";
import { env } from "./utils/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import cookieParser from "cookie-parser";
import allRouters from "./routers/index.js";
// import pino from "pino-http";
// import contactsRouter from "./routers/contacts.js";

const PORT = Number(env("PORT", "3000"));

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(cookieParser());
  // app.use(
  //   pino({
  //     transport: {
  //       target: "pino-pretty",
  //     },
  //   }),
  // );
  
  app.get("/", (req, res) => {
    res.json({
      message: "Hello!",
    });
  });
  app.use(allRouters);

  // app.use("/contacts", contactsRouter);

  app.use("*", notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
