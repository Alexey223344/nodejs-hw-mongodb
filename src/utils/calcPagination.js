export const calcPagination = (countItems, page, perPage) => {
  const countPages = Math.ceil(countItems / perPage);
  const hasNextPage = Boolean(countPages - page);
  const hasPreviousPage = page !== 1;
  return {
    page,
    perPage,
    countItems: countItems,
    countPages,
    hasPreviousPage,
    hasNextPage,
  };
};

