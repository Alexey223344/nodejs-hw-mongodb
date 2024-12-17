import { SORT_ORDER } from "../constants/constants.js";

const parseSortBy = (sortBy) => {
  const keysContacts = [
    "_id",
    "name",
    "phoneNumber",
    "email",
    "isFavourite",
    "contactType",
    "createdAt",
    "updatedAt",
  ];
  if (keysContacts.includes(sortBy)) return sortBy;
  return "name";
};

const parseSortOrder = (sortOrder) => {
  const isOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;
  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
