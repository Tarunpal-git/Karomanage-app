export const filterExpenseCategoriesData = (
  data: TExpenseCategories[],
  filters: {
    search: string;
  }
) => {
  const { search } = filters;

  return data.filter((category) => {
    const matchesSearch =
      !search ||
      `${category.categoryName}`.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });
};
