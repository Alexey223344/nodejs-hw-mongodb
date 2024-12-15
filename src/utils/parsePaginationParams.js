const parsePage = (value, defaultValue) => {
  if (typeof value !== "string") return defaultValue;
  const parseValues = parseInt(value, 15);
  if (Number.isNaN(parseValues)) return defaultValue;
  return parseValues;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parsePage(page, 1);
  const parsedPerPage = parsePage(perPage, 5);
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
