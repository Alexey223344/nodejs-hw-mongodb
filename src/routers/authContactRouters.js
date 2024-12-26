import { Router } from "express";
import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  logoutUserController,
  refreshSessionController,
  loginUserController,
  registerController,
} from "../controllers/authContacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../validation/authContacts.js";

const jsonParser = express.json();
const router = Router();

router.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);
router.post(
  "/login",
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

router.post("/refresh", ctrlWrapper(refreshSessionController));
router.post("/logout", ctrlWrapper(logoutUserController));

export default router;
