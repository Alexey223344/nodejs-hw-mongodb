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

export const updateContact = async (contactId, contact, options = {}) => {
  const rawResult = await ContactsAll.findByIdAndUpdate(contactId, contact, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  return !rawResult || !rawResult.value
    ? null
    : {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
      };
};

export const deleteContact = (contactId) => {
  return ContactsAll.findByIdAndDelete(contactId);
};
