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
import { verification } from "../middlewares/verification.js";
import { roles } from "../middlewares/roles.js";
import { ALL_ROLES } from "../constants/constants.js";
import { upload } from "../middlewares/download.js";

const jsonParser = express.json();

const router = Router();

router.get(
  "/",
  verification,
  roles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  ctrlWrapper(getContactsController),
);

router.get(
  "/:contactId",
  verification,
  roles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  "/",
  verification,
  roles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  jsonParser,
  upload.single("photo"),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  "/:contactId",
  verification,
  roles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  isValidId,
  jsonParser,
  upload.single("photo"),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete(
  "/:contactId",
  verification,
  roles(ALL_ROLES.ADMIN, ALL_ROLES.USER),
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
