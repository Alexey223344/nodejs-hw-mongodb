import { Router } from "express";
import express from "express";
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
} from "../controllers/contacts.js";

import { createContactSchema, updateContactSchema } from "../validation/validationContacts.js";

import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const jsonParser = express.json();

const router = Router();

router.get("/contacts", ctrlWrapper(getContactsController));

router.get("/contacts/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post("/contacts", jsonParser, validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch(
  "/contacts/:contactId",
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete("/contacts/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
