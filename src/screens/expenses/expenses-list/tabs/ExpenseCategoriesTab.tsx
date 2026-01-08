import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, memo, useMemo } from "react";

import { COLORS } from "../../../../colors";
import Avatar from "../../../../@ui/avatar/Avatar";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { useExpenseCategoriesQuery } from "../../../../apis/hooks/expenses/query/useExpenseCategories.query";
import { filterExpenseCategoriesData } from "../utils/filterExpenseCategoriesData";
import Center from "../../../../@ui/center/Center";
import CreateCategoryModal from "../components/CreateCategoryModal";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../../types/navigator/screen-navigator";

interface IExpenseCategoriesTab {
  filter: {
    search: string;
  };
  showModal: boolean;
  closeModal: () => void;
}

const ExpenseCategoriesTab: FC<IExpenseCategoriesTab> = ({
  filter,
  closeModal,
  showModal,
}) => {
  const navigation = useNavigation<TScreenNavigator>();
  const { isLoading, data, refetch } = useExpenseCategoriesQuery();

  const categoryList: TExpenseCategories[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return filterExpenseCategoriesData(data.data.expenseCategories, filter);
    } else {
      return [];
    }
  }, [isLoading, data, filter]);

  if (isLoading) {
    return <Center loading />;
  }

  return (
    <View style={{ width: "100%" }}>
      {categoryList.map((category, index) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ExpenseCategoryDetails", { category })
          }
          style={{
            ...styles.batchRow,
            borderBottomWidth: categoryList.length === index + 1 ? 0 : 1,
          }}
          key={category.id}
        >
          <Avatar
            textStyle={{ fontSize: 14 }}
            content={`${category.categoryName}`}
            size={30}
            characters={1}
          />
          <ScalableText style={styles.batchName} fontFamily="Medium">
            {category.categoryName}
          </ScalableText>
        </TouchableOpacity>
      ))}
      {showModal && (
        <CreateCategoryModal
          refetch={refetch}
          handleClose={closeModal}
          isVisible={showModal}
        />
      )}
    </View>
  );
};

export default memo(ExpenseCategoriesTab);

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
