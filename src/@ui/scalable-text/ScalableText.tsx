import React, { FunctionComponent, useMemo } from "react";
import {
  Dimensions,
  Text,
  StyleSheet,
  TextStyle,
  TextProps,
} from "react-native";
import { COLORS } from "../../colors";

const { width, height } = Dimensions.get("window");

const DEVICE_BASE_WIDTH = 375; // iPhone 6 width
const FONT_SIZE = 14;
const REAL_WIDTH = height > width ? width : height;

type ScaleText = {
  deviceBaseWidth?: number;
  fontSize?: number;
  lineHeight?: number;
  realWidth?: number;
};

export const scaleText = ({
  deviceBaseWidth = DEVICE_BASE_WIDTH,
  fontSize = FONT_SIZE,
  lineHeight = fontSize * 1.2, // Default line height is 120% of the font size.
}: ScaleText) => {
  return {
    fontSize: Math.round((fontSize * REAL_WIDTH) / deviceBaseWidth),
    lineHeight: Math.round((lineHeight * REAL_WIDTH) / deviceBaseWidth),
  };
};

export const useScaleText = ({
  deviceBaseWidth = DEVICE_BASE_WIDTH,
  fontSize = FONT_SIZE,
  lineHeight = fontSize * 1.2, // Default line height is 120% of the font size.
}: ScaleText) => {
  return useMemo(() => {
    return {
      fontSize: Math.round((fontSize * REAL_WIDTH) / deviceBaseWidth),
      lineHeight: Math.round((lineHeight * REAL_WIDTH) / deviceBaseWidth),
    };
  }, [deviceBaseWidth, fontSize, lineHeight]);
};

interface Props extends TextProps {
  deviceBaseWidth?: number;
  style?: TextStyle;
  fontFamily: "Regular" | "Medium" | "Bold" | "Black" | "Thin" | "SemiBold";
  ref?: React.LegacyRef<Text> | undefined;
}

const ScalableText: FunctionComponent<Props> = ({
  deviceBaseWidth,
  style = {},
  children,
  fontFamily,
  ref,
  ...props
}) => {
  const { fontSize, lineHeight } = StyleSheet.flatten(style);
  const { ...scaledText } = useScaleText({
    deviceBaseWidth,
    fontSize,
    lineHeight,
  });

  return (
    <Text
      ref={ref}
      style={StyleSheet.flatten([
        {
          fontFamily: `Poppins-${fontFamily}`,
          color: COLORS.black,
          marginTop: 5,
        },
        style,
        scaledText,
      ])}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ScalableText;
