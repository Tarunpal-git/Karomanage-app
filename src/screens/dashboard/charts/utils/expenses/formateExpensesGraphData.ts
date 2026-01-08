interface ExpenseData {
  dateCreated: string;
  expenseAmount: string;
  expensedateCreated: string;
}

interface GraphData {
  value: number;
  month: string;
}

interface FormattedExpenses {
  totalExpenses: number;
  graphData: GraphData[];
  maxValue: number;
}

export const formateExpensesGraphData = (
  data: ExpenseData[],
  year: number
): FormattedExpenses => {
  const monthlyExpenses: { [key: string]: number } = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  let totalExpenses = 0;
  let maxValue = 0;

  data.forEach((item) => {
    const expenseDate = new Date(item.expensedateCreated);
    const expenseYear = expenseDate.getFullYear();
    if (expenseYear === year) {
      const month = expenseDate.toLocaleString("default", { month: "short" });
      const expenseAmount = parseFloat(item.expenseAmount);
      monthlyExpenses[month] += expenseAmount;
      totalExpenses += expenseAmount;
    }
  });
  maxValue = Math.max(...Object.values(monthlyExpenses));
  maxValue = Math.ceil(maxValue / 100) * 100;
  const graphData: GraphData[] = Object.keys(monthlyExpenses).map((month) => ({
    value: monthlyExpenses[month],
    month,
  }));

  return {
    totalExpenses,
    graphData,
    maxValue,
  };
};
