import * as yup from "yup";

export const createExpenseValidation = yup.object().shape({
  expenseName: yup.string().required("Expense name is required"),
  expenseAmount: yup.string().required("Expense amount is required"),
  expensedateCreated: yup.string().required("Expenditure date is required"),
  expensePaymentStatus: yup
    .string()
    .required("Expense payment status is required"),
});
