import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";
import React, { FC } from "react";
import { COLORS } from "../../colors";

interface ICenter {
  children?: React.ReactNode;
  styles?: ViewStyle;
  loading?: boolean;
}

const Center: FC<ICenter> = ({ children, styles, loading }) => {
  return (
    <View style={{ ...classes.root, ...styles }}>
      {loading ? (
        <ActivityIndicator color={COLORS.primary} size={24} />
      ) : (
        children
      )}
    </View>
  );
};

export default Center;

const classes = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
