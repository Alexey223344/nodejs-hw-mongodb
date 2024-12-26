import { Router } from "express";
import express from "express";
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
} from "../controllers/contacts.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/validationContacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authVerification } from "../middlewares/authVerification.js";
import { allRoles } from "../middlewares/roles.js";
import { ALL_ROLES } from "../constants/constants.js";

const jsonParser = express.json();
const router = Router();

router.get(
  "/",
  authVerification,
  allRoles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  ctrlWrapper(getContactsController),
);

router.get(
  "/:contactId",
  authVerification,
  allRoles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  "/",
  authVerification,
  allRoles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  "/:contactId",
  authVerification,
  allRoles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete(
  "/:contactId",
  authVerification,
  allRoles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
