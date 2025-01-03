import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { downloadCloudinary } from "../utils/downloadCloudinary.js";
import createHttpError from "http-errors";

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const { user } = req;
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    user,
  });
  if (!contacts) throw createHttpError(404, "Контакт не знайдено");
  res.status(200).json({
    status: 200,
    message: "Успішно знайдені контакти!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { user } = req;
  const contact = await getContactById(contactId, user);
  if (!contact) {
    throw createHttpError(404, "Контакт не знайдено");
  }

  res.status(200).json({
    status: 200,
    message: `Успішно знайдено контакт з Id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  // console.log(req.file);
  const photo = req.file;
  let photoUrl;
  if (photo) {
    const resultPhoto = await downloadCloudinary(req.file.path);
    photoUrl = resultPhoto;
    
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createHttpError(400, "Відсутнє тіло запиту");
  }
  const { user } = req;
  const result = await createContact({
    ...req.body,
    userId: user._id,
    photo: photoUrl,
  });
  if (!result) throw createHttpError(404, "Відправлене для створення контакту");

  res.status(201).json({
    status: 201,
    message: "Успішно створено контакт!",
    data: result,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { user } = req;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    const result = await downloadCloudinary(req.file.path);

    photoUrl = result;
  }
  const result = await updateContact(contactId, user, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, "контакт не знайдено"));
    return;
  }

  res.status(200).json({
    status: 200,
    message: "Успішно виправлено контакт!",
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { user } = req;
  const result = await deleteContact(contactId, user);
  if (!result) next(createHttpError(404, "Контакт не знайдено"));

  res.status(204).end();
};
