// import createHttpError from 'http-errors';
import { ContactsAll } from "../db/models/contact.js";
import { calculatePagination } from "../utils/calcPagination.js";

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter = {} }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactsQuery = ContactsAll.find();
  if (filter.contactType) {
    contactsQuery.where("contactType").equals(filter.contactType);
  }
  if (filter.isFavourite === "boolean") {
    contactsQuery.where("isFavourite").equals(filter.isFavourite);
  }
  const [countContacts, contacts] = await Promise.all([
    ContactsAll.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paramsPagination = calculatePagination(countContacts, page, perPage);
  return { data: contacts, ...paramsPagination };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsAll.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsAll.create(payload);
  return contact;
};

export const updateContact = async (contactId, contactData) => {
  const contact = await ContactsAll.findByIdAndUpdate(contactId, contactData, {
    new: true,
  });
  return contact;
};

// export const updateContact = async (contactId, contact, options = {}) => {

//   const updateContact = await ContactsAll.findByIdAndUpdate(
//     contactId,
//     contact,
//     {
//       new: true,
//       ...options,
//     },
//   );

//   if (!updateContact) {
//     throw createHttpError(404, 'contact not found');
//   }
//   return {
//     contact: updateContact,
//     isNew: options.upsert || false,
//   };
// };

export const deleteContact = (contactId) => {
  return ContactsAll.findByIdAndDelete(contactId);
};
