import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC, memo, useEffect, useRef } from "react";
import Flex from "../../../../@ui/flex/Flex";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../colors";

interface IExpenseTabs {
  activeTab: string;
  setActiveTab: (e: string) => void;
}

const ExpenseTabs: FC<IExpenseTabs> = ({ activeTab, setActiveTab }) => {
  const animatedLeft = useRef(new Animated.Value(0)).current;
  const animatedWidth = useRef(new Animated.Value(96)).current; // default width for "expenses"

  useEffect(() => {
    const newLeft = activeTab === "expenses" ? 8 : 140; // adjust these values accordingly
    const newWidth = activeTab === "expenses" ? 48 : 90; // adjust these values accordingly

    Animated.timing(animatedLeft, {
      toValue: newLeft,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedWidth, {
      toValue: newWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const animatedStyle = {
    left: animatedLeft,
    width: animatedWidth,
  };

  return (
    <Flex styles={styles.root} mb={20}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => setActiveTab("expenses")}
      >
        <ScalableText
          style={{
            ...styles.categoryText,
            color: activeTab === "expenses" ? COLORS.primary : COLORS.black,
          }}
          fontFamily="Medium"
        >
          Expense
        </ScalableText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => setActiveTab("expensesCategory")}
      >
        <ScalableText
          style={{
            ...styles.categoryText,
            color:
              activeTab === "expensesCategory" ? COLORS.primary : COLORS.black,
          }}
          fontFamily="Medium"
        >
          Expense Category
        </ScalableText>
      </TouchableOpacity>
      <Animated.View style={[styles.activeTab, animatedStyle]} />
    </Flex>
  );
};

export default memo(ExpenseTabs);

const styles = StyleSheet.create({
  root: {
    borderBottomColor: "#E3E3E3",
    borderBottomWidth: 1,
    paddingBottom: 14,
  },
  categoryText: {},
  tab: {
    marginRight: 52,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 2,
    position: "absolute",
    bottom: -1,

    right: 0,
  },
});
