// import createHttpError from 'http-errors';
import { ContactsAll } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsAll.find();
  return contacts;
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
