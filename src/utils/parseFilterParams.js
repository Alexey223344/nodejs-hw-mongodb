const parseContactType = (contactType) => {
  if (typeof contactType !== "string") return;

  const isValidType = (contactType) =>
    ["work", "home", "personal"].includes(contactType);
  if (isValidType(contactType)) return contactType;
};

const parseFilterIsFavorite = (isFavorited) => {
  if (typeof isFavorited !== "string") return;
  let valueFilter = undefined;
  if (isFavorited === "true") {
    valueFilter = true;
  } else if (isFavorited === "false") {
    valueFilter = false;
  }
  if (typeof valueFilter !== "boolean") return;
  return valueFilter;
};

export const parseFilterParam = (query) => {
  const { type, isFavorited } = query;
  const parsedContactType = parseContactType(type);
  const parsedFilterIsFavorite = parseFilterIsFavorite(isFavorited);
  return {
    contactType: parsedContactType,
    isFavorited: parsedFilterIsFavorite,
  };
};
