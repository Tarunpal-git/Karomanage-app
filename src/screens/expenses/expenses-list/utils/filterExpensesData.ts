export const filterExpensesData = (
  data: TExpenseData[],
  filters: {
    search: string;
  }
) => {
  const { search } = filters;

  return data.filter((expense) => {
    const matchesSearch =
      !search ||
      `${expense.expenseName}`.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });
};
