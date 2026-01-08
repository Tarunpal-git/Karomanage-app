import { StyleSheet, View } from "react-native";
import React, { FC, memo } from "react";
import TabItem from "./TabItem";

interface ITabs {
  onChange: (tab: string) => void;
  value: string;
  tabs: { label: string; value: string; flex?: number }[];
  disabled?: boolean;
}

const Tabs: FC<ITabs> = ({ onChange, tabs = [], value, disabled }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TabItem
          onChange={onChange}
          tab={tab}
          value={value}
          key={tab.value}
          disabled={disabled}
        />
      ))}
    </View>
  );
};

export default memo(Tabs);

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
  },
});
