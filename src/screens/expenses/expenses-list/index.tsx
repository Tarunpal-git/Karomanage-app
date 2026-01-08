import React, { useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../../@ui/flex/Flex";
import SearchBar from "../../../@ui/search-bar/SearchBar";
import Button from "../../../@ui/button/Button";
import { StyleSheet } from "react-native";
import { COLORS } from "../../../colors";
import ExpenseTabs from "./components/ExpenseTabs";
import Collapsible from "../../../@ui/collapsible/Collapsible";
import ExpensesListTab from "./tabs/ExpensesListTab";
import ExpenseAmountSection from "./components/ExpenseAmountSection";
import ExpenseCategoriesTab from "./tabs/ExpenseCategoriesTab";

const Expenses = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [filter, setFilter] = useState({ search: "" });
  const [activeTab, setActiveTab] = useState("expenses");
  const [categoryModal, setCategoryModal] = useState(false);

  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        title="Expense"
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView paddingHorizontal={15}>
        <Flex mt={2} my={20}>
          <SearchBar
            value={filter.search}
            onChange={(text) =>
              setFilter((state) => ({ ...state, search: text }))
            }
          />
          <Button
            onPress={() => {
              if (activeTab !== "expenses") {
                setCategoryModal(true);
              } else {
                navigation.navigate("CreateExpense");
              }
            }}
            btnStyles={{ width: 139, marginLeft: 8, height: 40, elevation: 4 }}
            btnTxtStyles={{ fontFamily: "Poppins-Regular", fontSize: 12 }}
            title={activeTab === "expenses" ? "Add Expense" : "Add category"}
          />
        </Flex>
        <ExpenseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <Collapsible isCollapsed={activeTab === "expenses"}>
          <ExpenseAmountSection filter={filter} />
        </Collapsible>
        <Flex flexDirection="column" styles={styles.expensesListContainer}>
          {activeTab === "expenses" && <ExpensesListTab filter={filter} />}
          {activeTab === "expensesCategory" && (
            <ExpenseCategoriesTab
              closeModal={() => setCategoryModal(false)}
              showModal={categoryModal}
              filter={filter}
            />
          )}
        </Flex>
      </ThemeScrollView>
    </SafeView>
  );
};

export default Expenses;

const styles = StyleSheet.create({
  expensesListContainer: {
    backgroundColor: COLORS.white,
    elevation: 4,
    flex: 1,
    borderRadius: 10,
    padding: 20,
  },
});
