export const filterCategoriesExpense = (
  expenses: TExpenseData[],
  categoryId: string
) => {
  // Filter expenses where the expenseId exists in the categoryExpenseIds set
  return expenses.filter(
    // (expense) => expense.expenseCategories?.[0].categoryId === categoryId
    (expense) =>
      expense.expenseCategories &&
      Array.isArray(expense.expenseCategories) &&
      expense.expenseCategories[0]?.categoryId === categoryId
  );
};
