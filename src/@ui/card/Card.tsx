import {
  ViewStyle,
  FlexStyle,
  DimensionValue,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { FC, memo } from "react";
import { COLORS } from "../../colors";

interface ICard {
  children?: React.ReactNode;
  flexDirection?: FlexStyle["flexDirection"];
  align?: FlexStyle["alignItems"];
  justify?: FlexStyle["justifyContent"];
  mr?: FlexStyle["marginRight"];
  ml?: FlexStyle["marginLeft"];
  mt?: FlexStyle["marginTop"];
  mb?: FlexStyle["marginBottom"];
  mx?: FlexStyle["marginHorizontal"];
  my?: FlexStyle["marginHorizontal"];
  styles?: ViewStyle;
  w?: DimensionValue;
  flex?: number;
  onPress?: () => void;
}

const Card: FC<ICard> = ({
  children,
  flexDirection = "column",
  align = "center",
  justify,
  mb,
  ml,
  mr,
  mt,
  mx,
  my,
  styles,
  flex,
  w,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection,
        flex,
        alignItems: align,
        justifyContent: justify,
        marginLeft: ml,
        marginRight: mr,
        marginTop: mt,
        marginBottom: mb,
        marginHorizontal: mx,
        marginVertical: my,
        width: w ?? "auto",
        ...classes.root,
        ...styles,
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

export default memo(Card);

const classes = StyleSheet.create({
  root: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 10,
  },
});
