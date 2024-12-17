const parsePage = (number, defaultValue) => {
  const filters = typeof number === "string";
  if(!filters) return defaultValue;
  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return defaultValue;
  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parsePage(page, 1);
  const parsedPerPage = parsePage(perPage, 10);
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
