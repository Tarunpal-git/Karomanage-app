import { StyleSheet, View } from "react-native";
import React, { FC } from "react";

interface IDivider {
  my?: number;
  w?: number;
  mx?: number;
}

const Divider: FC<IDivider> = ({ my, w, mx }) => {
  return (
    <View
      style={{
        ...styles.root,
        marginVertical: my,
        marginHorizontal: mx,
        width: w,
      }}
    />
  );
};

export default Divider;

const styles = StyleSheet.create({
  root: {
    borderColor: "#C0C0C0",
    borderBottomWidth: 1,
    width: "100%",
  },
});
