import React from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import Expenses from "../../../screens/expenses/expenses-list";
import CreateExpense from "../../../screens/expenses/create-expense";
import ExpenseDetails from "../../../screens/expenses/expense-details";
import ExpenseCategoryDetails from "../../../screens/expenses/expense-category-details";

const ExpensesStackNavigator = () => {
  const Stack = createNativeStackNavigator<TExpensesStackNavigatorParams>();
  return (
    <Stack.Navigator
      initialRouteName="ExpensesLists"
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Stack.Screen name="ExpensesLists" component={Expenses} />
      <Stack.Screen name="CreateExpense" component={CreateExpense} />
      <Stack.Screen name="ExpenseDetails" component={ExpenseDetails} />
      <Stack.Screen
        name="ExpenseCategoryDetails"
        component={ExpenseCategoryDetails}
      />
    </Stack.Navigator>
  );
};

export default ExpensesStackNavigator;

export type TExpensesStackNavigator =
  NativeStackNavigationProp<TExpensesStackNavigatorParams>;
