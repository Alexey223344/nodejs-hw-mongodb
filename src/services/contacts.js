// import createHttpError from 'http-errors';
import { ContactsAll } from "../db/models/contact.js";
import { calculatePagination } from "../utils/calcPagination.js";

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
  user,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactsQuery = ContactsAll.find({ userId: user._id });
  if (filter.contactType) {
    contactsQuery.where("contactType").equals(filter.contactType);
  }
  if (typeof filter.isFavourite === "boolean") {
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

export const getContactById = async (contactId, user) => {
  const contact = await ContactsAll.findById({
    _id: contactId,
    userId: user._id,
  });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsAll.create(payload);
  return contact;
};

export const updateContact = async (contactId, contactData, user) => {
  const contact = await ContactsAll.findOneAndUpdate(
    { _id: contactId, userId: user._id },
    contactData,
    { new: true },
  );
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

export const deleteContact = (contactId, user) => {
  return ContactsAll.findOnedAndDelete({
    _id: contactId,
    userId: user._id,
  });
};
