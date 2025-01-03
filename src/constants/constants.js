import path from "path";

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};

export const TWENTY_MINUTES = 20 * 60 * 1000;
export const TWENTY_DAY = 20 * 24 * 60 * 1000;
export const ALL_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const SMTP = {
  SMTP_HOST: "SMTP_HOST",
  SMTP_PORT: "SMTP_PORT",
  SMTP_USER: "SMTP_USER",
  SMTP_PASSWORD: "SMTP_PASSWORD",
  SMTP_FROM: "SMTP_FROM",
};

export const CLOUDINARY = {
  CLOUD_NAME: "CLOUD_NAME",
  API_KEY: "API_KEY",
  API_SECRET: "API_SECRET",
};

export const TEMPLATE_DIR = path.join(process.cwd(), "src", "templates");
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), "src", "temp");
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export const SWAGGER_PATH = path.join(process.cwd(), "docs", "swagger.json");
