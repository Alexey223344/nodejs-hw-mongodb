import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(18).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(18).required(),
});

export const reqResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resResetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(4).max(15).required(),
});
