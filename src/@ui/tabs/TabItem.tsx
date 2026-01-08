import { StyleSheet } from "react-native";
import React, { FC, memo } from "react";
import ActionIcon from "../action-icon/ActionIcon";
import ScalableText from "../scalable-text/ScalableText";
import { COLORS } from "../../colors";
import Flex from "../flex/Flex";

interface ITabItem {
  tab: { label: string; value: string; flex?: number };
  value: string;
  onChange: (e: string) => void;
  disabled?: boolean;
}

const TabItem: FC<ITabItem> = ({ onChange, tab, value, disabled }) => {
  return (
    <ActionIcon
      styles={{ ...styles.tabItem, flex: tab.flex ?? 1 }}
      onPress={() => onChange(tab.value)}
      disabled={disabled}
    >
      <ScalableText
        style={{
          ...styles.tabText,
          color: tab.value === value ? COLORS.primary : COLORS.black,
        }}
        fontFamily="SemiBold"
      >
        {tab.label}
      </ScalableText>
      {tab.value === value && <Flex styles={{ ...styles.activeBorder }} />}
    </ActionIcon>
  );
};

export default memo(TabItem);

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 7,
    textAlign: "center",
  },
  activeBorder: {
    height: 2,
    backgroundColor: COLORS.primary,
    width: 84,
  },
});
