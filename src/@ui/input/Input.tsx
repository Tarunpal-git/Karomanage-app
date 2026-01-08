import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React, { FC, memo } from "react";
import Flex from "../flex/Flex";
import { COLORS } from "../../colors";
import { Controller, UseFormReturn } from "react-hook-form";
import ScalableText from "../scalable-text/ScalableText";

interface IInput extends TextInputProps {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
  keyboardType?: KeyboardTypeOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  containerStyles?: ViewStyle;
  inputStyles?: TextStyle;
  inputRoot?: ViewStyle;
  errorStyle?: TextStyle;
  onChangeText?: (text: string) => void;
  onBlur?: (e: any) => void;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
}

const Input: FC<IInput> = ({
  rightIcon,
  leftIcon,
  handler,
  label,
  name,
  keyboardType,
  containerStyles,
  inputStyles,
  inputRoot,
  errorStyle,
  editable,
  onChangeText,
  onBlur: customOnBlur,
  maxLength,
  multiline,
  numberOfLines,
  ...restProps
}) => {
  return (
    <Controller
      control={handler.control}
      name={name}
      render={({ field: { onChange, value, onBlur }, fieldState }) => {
        return (
          <View style={{ flex: 1, ...containerStyles }}>
            <Flex styles={{ ...styles.inputRoot, ...inputRoot }}>
              {leftIcon}
              <TextInput
                placeholder={label}
                placeholderTextColor={"#838383"}
                style={{ ...styles.textInput, ...inputStyles }}
                value={typeof value === 'string' ? value : value !== undefined && value !== null ? value.toString() : ''}
                onChangeText={(text) => {
                  onChange(text);
                  if (onChangeText) {
                    onChangeText(text);
                  }
                }}
                onBlur={(e) => {
                  onBlur();
                  if (customOnBlur) {
                    customOnBlur(e);
                  }
                }}
                keyboardType={keyboardType}
                editable={editable}
                maxLength={maxLength}
                multiline={multiline}
                numberOfLines={numberOfLines}
                {...restProps}
              />
              {rightIcon}
            </Flex>
            {fieldState.error && (
              <ScalableText
                fontFamily="Regular"
                style={{
                  color: COLORS.error,
                  fontSize: 12,
                  marginTop: 4,
                  ...errorStyle,
                }}
              >
                ⚠️ {fieldState.error.message}
              </ScalableText>
            )}
          </View>
        );
      }}
    />
  );
};

export default memo(Input);

const styles = StyleSheet.create({
  inputRoot: {
    color: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textInput: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
    flex: 1,
    height: 48,
  },
});
