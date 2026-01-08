import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import React, { FC, memo } from "react";
import { COLORS } from "../../colors";
import Flex from "../flex/Flex";
import ScalableText from "../scalable-text/ScalableText";

interface IButton {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  btnStyles?: ViewStyle;
  btnTxtStyles?: TextStyle;
}

const Button: FC<IButton> = ({
  title,
  btnStyles,
  btnTxtStyles,
  disabled = false,
  leftIcon,
  loading,
  onPress,
  rightIcon,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.root,
        {
          backgroundColor: disabled ? "#9A9A9A" : styles.root?.backgroundColor,
        },
        { ...btnStyles },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            btnStyles?.backgroundColor === COLORS.white
              ? COLORS.black
              : COLORS.white
          }
          size={18}
        />
      ) : (
        <Flex justify="center" w={"100%"}>
          {leftIcon}
          <ScalableText
            fontFamily="SemiBold"
            style={{ ...styles.btnText, ...btnTxtStyles }}
          >
            {title}
          </ScalableText>
          {rightIcon}
        </Flex>
      )}
    </TouchableOpacity>
  );
};

export default memo(Button);

const styles = StyleSheet.create({
  root: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,

    elevation: 4,
  },
  btnText: {
    color: "#FBFDFF",
    fontSize: 20,
  },
});
