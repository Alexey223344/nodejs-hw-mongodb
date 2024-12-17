export const calculatePagination = (total, page, perPage) => {
  const countPages = Math.ceil(total / perPage);
  const hasNextPage = Boolean(countPages - page);
  const hasPreviousPage = page !== 1;
  return {
    page,
    perPage,
    totalItems: total,
    countPages,
    hasPreviousPage,
    hasNextPage,
  };
};

