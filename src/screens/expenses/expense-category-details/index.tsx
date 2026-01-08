import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";

import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import Avatar from "../../../@ui/avatar/Avatar";
import ScalableText from "../../../@ui/scalable-text/ScalableText";

import { useExpensesListsQuery } from "../../../apis/hooks/expenses/query/useExpensesLists.query";
import { getStatusColor } from "../../../utils/getStatusColor";
import moment from "moment";
import SearchBar from "../../../@ui/search-bar/SearchBar";
import { filterExpensesData } from "../expenses-list/utils/filterExpensesData";
import ExpenseAmountSection from "../expenses-list/components/ExpenseAmountSection";
import { TouchableOpacity } from "react-native-gesture-handler";
import { filterCategoriesExpense } from "./utils/filterCategoriesExpenses";
import Center from "../../../@ui/center/Center";
import { isEmptyString } from "../../../utils/isEmptyString";

const ExpenseCategoryDetails = () => {
  const [filter, setFilter] = useState({ search: "" });

  const navigation = useNavigation<TScreenNavigator>();
  const { category } =
    useRoute<
      RouteProp<TExpensesStackNavigatorParams, "ExpenseCategoryDetails">
    >().params;

  const { data, isLoading, refetch } = useExpensesListsQuery();

  const expensesList: TExpenseData[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      const categoriesExpenses = filterCategoriesExpense(
        data.data,
        category.categoryId
      );

      return filterExpensesData(categoriesExpenses, filter);
    } else {
      return [];
    }
  }, [data, isLoading, filter]);

  return (
    <SafeView>
      <AppHeader
        title={"Single Category"}
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView
        reloadData={() => {
          refetch();
        }}
        loading={isLoading}
      >
        <Flex mt={10} my={20}>
          <SearchBar
            onChange={(text) =>
              setFilter((state) => ({ ...state, search: text }))
            }
            value={filter.search}
          />
        </Flex>
        <View style={styles.formRoot}>
          <Flex flexDirection="column" my={24}>
            <Avatar
              content={category?.categoryName}
              size={53}
              textStyle={{ fontSize: 20 }}
            />
            <ScalableText
              style={{ color: COLORS.primary, fontSize: 16, marginTop: 12 }}
              fontFamily="Bold"
            >
              {isEmptyString(category?.categoryName)}
            </ScalableText>
          </Flex>

          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Name:{" "}
            </ScalableText>
            <ScalableText style={styles.detailsContent} fontFamily="Medium">
              {isEmptyString(category?.categoryName)}{" "}
            </ScalableText>
          </Flex>

          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Description:
            </ScalableText>
            <ScalableText style={styles.detailsContent} fontFamily="Medium">
              {isEmptyString(category?.categoryDescription)}
            </ScalableText>
          </Flex>
          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Add Expense Count:
            </ScalableText>
            <ScalableText style={styles.detailsContent} fontFamily="Medium">
              {category?.expenses.length}
            </ScalableText>
          </Flex>
          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Status:
            </ScalableText>
            <ScalableText
              style={{
                ...styles.detailsContent,
                color: getStatusColor(category?.categoryStatus),
              }}
              fontFamily="Medium"
            >
              {isEmptyString(category?.categoryStatus)}
            </ScalableText>
          </Flex>
          <Flex my={15} flexWrap="wrap">
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Date Created:
            </ScalableText>
            <ScalableText
              style={{
                ...styles.detailsContent,
              }}
              fontFamily="Medium"
            >
              {moment.unix(category.dateCreated / 1000).format("DD/MM/YYYY")}
            </ScalableText>
          </Flex>
        </View>
        <Flex my={20} mb={0}>
          <ExpenseAmountSection
            categoryExpenses={category.categoryId}
            filter={filter}
          />
        </Flex>

        <View style={styles.expensesListContainer}>
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

          {expensesList.length === 0 && (
            <Center styles={{ minHeight: 100 }}>
              <ScalableText fontFamily="Medium">No Expenses Found</ScalableText>
            </Center>
          )}
        </View>
      </ThemeScrollView>
    </SafeView>
  );
};

export default ExpenseCategoryDetails;

const styles = StyleSheet.create({
  formRoot: {
    padding: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 7,
    marginVertical: 5,
    elevation: 2,
    backgroundColor: COLORS.white,
    flexDirection: "column",
  },
  detailsHeading: {
    fontSize: 16,
    marginRight: 10,
  },
  detailsContent: {
    color: "#646464",
    fontSize: 14,
    textTransform: "capitalize",
  },
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
  expensesListContainer: {
    backgroundColor: COLORS.white,
    elevation: 4,
    flex: 1,
    borderRadius: 10,
    padding: 20,
  },
});
