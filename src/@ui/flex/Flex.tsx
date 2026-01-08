import {
  ViewStyle,
  FlexStyle,
  DimensionValue,
  TouchableOpacity,
} from "react-native";
import React, { FC, memo } from "react";

interface IFlex {
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
  onClick?: () => void;
  flexWrap?: FlexStyle["flexWrap"];
}

const Flex: FC<IFlex> = ({
  children,
  flexDirection = "row",
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
  flexWrap,
  onClick = undefined,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={!onClick}
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
        flexWrap: flexWrap ?? "nowrap",
        ...styles,
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

export default memo(Flex);
