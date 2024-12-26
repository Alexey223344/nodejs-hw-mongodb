import { model, Schema } from "mongoose";
import { ALL_ROLES } from "../../constants/constants.js";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [ALL_ROLES.ADMIN, ALL_ROLES.USER],
      default: ALL_ROLES.USER,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJson = function () {
  const obj = this.toObjects();
  delete obj.password;
  return obj;
};

export const User = model("users", userSchema);
