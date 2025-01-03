import { Router } from "express";
import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerController,
  reqResetEmailController,
  resResetPasswordController,
} from "../controllers/authContacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  registerSchema,
  loginSchema,
  reqResetEmailSchema,
  resResetPasswordSchema,
} from "../validation/authContacts.js";

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

router.post(
  "/send-reset-email",
  jsonParser,
  validateBody(reqResetEmailSchema),
  ctrlWrapper(reqResetEmailController),
);

router.post(
  "/reset-pwd",
  jsonParser,
  validateBody(resResetPasswordSchema),
  ctrlWrapper(resResetPasswordController),
);

export default router;
