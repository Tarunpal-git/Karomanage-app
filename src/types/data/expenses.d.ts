interface TExpenseCategory {
  categoryId: string;
}

type TExpenseData = {
  customerId: string;
  organizationId: string;
  expenseId: string;
  expenseName: string;
  expenseDescription: string;
  expenseAmount: string;
  expenseMode: string;
  expensedateCreated: string;
  expensePaymentStatus: string;
  paidByEmployee: string;
  dateCreated: number;
  expenseCategories: TExpenseCategory[];
  currencyCode: string;
  expenseStatus: string;
  id: string;
  file?: string;
};
