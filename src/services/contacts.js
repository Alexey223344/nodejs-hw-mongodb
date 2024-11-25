import { ContactsAll } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsAll.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsAll.findById(contactId);
  return contact;
};