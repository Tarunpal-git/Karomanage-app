import React, { FC, memo, useEffect, useMemo } from "react";
import Flex from "../../../../@ui/flex/Flex";
import ExpenseCard from "./ExpenseCard";
import { useExpensesListsQuery } from "../../../../apis/hooks/expenses/query/useExpensesLists.query";
import { filterExpensesData } from "../utils/filterExpensesData";
import { filterExpensesAmount } from "../utils/filterExpensesAmout";
import { useIsFocused } from "@react-navigation/native";
import { filterCategoriesExpense } from "../../expense-category-details/utils/filterCategoriesExpenses";

interface IExpenseAmountSection {
  filter: {
    search: string;
  };
  categoryExpenses: string
}

const ExpenseAmountSection: FC<IExpenseAmountSection> = ({
  filter,
  categoryExpenses,
}) => {
  
  const { isLoading, data, refetch } = useExpensesListsQuery();

  const isFocused = useIsFocused();

  const fetchTotalExpensesAmount = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      if (categoryExpenses) {
        const categoriesExpenses = filterCategoriesExpense(
          data.data,
          categoryExpenses
        );
        const filteredData = filterExpensesData(categoriesExpenses, filter);

        return filterExpensesAmount(filteredData);
      } else {
        const filteredData = filterExpensesData(data.data, filter);
        return filterExpensesAmount(filteredData);
      }
    } else {
      return {
        currentMonthExpenses: 0,
        lastMonthExpenses: 0,
        allExpenses: 0,
      };
    }
  }, [isLoading, data, filter]);

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  return (
    <Flex justify="space-between" mb={35}>
      <ExpenseCard
        amount={
          isNaN(fetchTotalExpensesAmount.currentMonthExpenses)
            ? 0
            : fetchTotalExpensesAmount.currentMonthExpenses
        }
        title="Current Month Expense"
      />
      <ExpenseCard
        amount={
          isNaN(fetchTotalExpensesAmount.lastMonthExpenses)
            ? 0
            : fetchTotalExpensesAmount.lastMonthExpenses
        }
        title={`Last Month\n Expense`}
        cardStyles={{ marginHorizontal: 15 }}
      />
      <ExpenseCard
        amount={
          isNaN(fetchTotalExpensesAmount.allExpenses)
            ? 0
            : fetchTotalExpensesAmount.allExpenses
        }
        title="All Expense"
      />
    </Flex>
  );
};

export default memo(ExpenseAmountSection);
