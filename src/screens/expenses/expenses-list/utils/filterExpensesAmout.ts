import moment from "moment";

export const filterExpensesAmount = (expensesData: TExpenseData[]) => {
  const currentMonth = moment().month();
  const lastMonth = moment().subtract(1, "months").month();

  let currentMonthExpenses = 0;
  let lastMonthExpenses = 0;
  let allExpenses = 0;

  expensesData.forEach((expense) => {
    const expenseDate = moment(expense.expensedateCreated);

    if (expenseDate.isValid()) {
      const expenseAmount = parseFloat(expense.expenseAmount);

      if (expenseDate.month() === currentMonth) {
        currentMonthExpenses += expenseAmount;
      } else if (expenseDate.month() === lastMonth) {
        lastMonthExpenses += expenseAmount;
      }

      allExpenses += expenseAmount;
    }
  });

  return {
    currentMonthExpenses,
    lastMonthExpenses,
    allExpenses,
  };
};
