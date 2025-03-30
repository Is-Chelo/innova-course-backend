export const convertToSlug = (text: string) => {
  return text
    .toLocaleLowerCase()
    .trim()
    .replace(/[\s\W]/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const paginate = (totalItems: number, countPerPage: number) => {
  return {
    totalItems: totalItems,
    lastPage: Math.ceil(totalItems / countPerPage),
  };
};
