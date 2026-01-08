import { EXPENSES_PREFIX } from "../../constants";

export const ExpensesUrls = {
  FETCH_EXPENSES_LIST: EXPENSES_PREFIX + "listAllExpense",
  FETCH_EXPENSES_CATEGORY: EXPENSES_PREFIX + "listAllExpenseCategories",
  CREATE_EXPENSE: EXPENSES_PREFIX + "createExpense",
  CREATE_EXPENSE_CATEGORY: EXPENSES_PREFIX + "createExpenseCategories",
  FETCH_EXPENSE_DETAILS: EXPENSES_PREFIX + "listOneExpense",
};
