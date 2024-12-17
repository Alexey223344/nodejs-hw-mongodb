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

const router = Router();

const jsonParser = express.json();


router.get("/", ctrlWrapper(getContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post("/", jsonParser, validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch(
  "/:contactId",
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
