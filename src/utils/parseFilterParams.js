const parseContactType = (contactType) => {
  const filters = typeof contactType === "string";
  if (!filters) return;

  const isValidType = (contactType) => ["work", "home", "personal"].includes(contactType);
  if (isValidType(contactType)) return contactType;
};

const parseFilterIsFavorite = (isFavourite) => {
  const filters = typeof isFavourite === "string";
  if (!filters) return;
  let valueFilter = undefined;
  if (isFavourite === "true") {
    valueFilter = true;
  } else if (isFavourite === "false") {
    valueFilter = false;
  }
  if (typeof valueFilter !== "boolean") return;
  return valueFilter;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;
  const parsedContactType = parseContactType(contactType);
  const parsedFilterIsFavorite = parseFilterIsFavorite(isFavourite);
  return {
    contactType: parsedContactType,
    isFavourite: parsedFilterIsFavorite,
  };
};
