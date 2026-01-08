type TExpenseCategoriesExpense = {
  expenseId: string;
  dateCreated: number;
  status: string;
};

type TExpenseCategories = {
  customerId: string;
  organizationId: string;
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  dateCreated: number;
  expenses: TExpenseCategoriesExpense[];
  categoryStatus: string;
  id: string;
};
