import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, memo, useEffect, useMemo } from "react";
import { useExpensesListsQuery } from "../../../../apis/hooks/expenses/query/useExpensesLists.query";
import { filterExpensesData } from "../utils/filterExpensesData";
import { COLORS } from "../../../../colors";
import Avatar from "../../../../@ui/avatar/Avatar";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import Center from "../../../../@ui/center/Center";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../../types/navigator/screen-navigator";

interface IExpensesListTab {
  filter: {
    search: string;
  };
}

const ExpensesListTab: FC<IExpensesListTab> = ({ filter }) => {
  const navigation = useNavigation<TScreenNavigator>();
  const { isLoading, data, refetch } = useExpensesListsQuery();
  const isFocused = useIsFocused();
  const expensesList: TExpenseData[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return filterExpensesData(data.data, filter);
    } else {
      return [];
    }
  }, [isLoading, data, filter]);

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  if (isLoading) {
    return <Center loading />;
  }

  return (
    <View style={{ width: "100%" }}>
      {expensesList.map((expense, index) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ExpenseDetails", {
              expenseId: expense.expenseId,
              expenseName: expense.expenseName,
            })
          }
          style={{
            ...styles.batchRow,
            borderBottomWidth: expensesList.length === index + 1 ? 0 : 1,
          }}
          key={expense.id}
        >
          <Avatar
            textStyle={{ fontSize: 14 }}
            content={`${expense.expenseName}`}
            size={30}
            characters={1}
          />
          <ScalableText style={styles.batchName} fontFamily="Medium">
            {expense.expenseName}
          </ScalableText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default memo(ExpensesListTab);

const styles = StyleSheet.create({
  batchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingTop: 0,
    paddingBottom: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#BEBEBE",
    paddingHorizontal: 5,
  },
  batchName: {
    fontSize: 14,
    textTransform: "capitalize",
    marginLeft: 22,
  },
});
