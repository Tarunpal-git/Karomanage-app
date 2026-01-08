import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { FC, memo, useState } from "react";
import ScalableText from "../scalable-text/ScalableText";
import { COLORS } from "../../colors";
import { Controller, UseFormReturn } from "react-hook-form";
import DatePicker from "react-native-date-picker";
import moment from "moment";

interface IDateInput {
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
  inputRoot?: ViewStyle;
  errorStyle?: TextStyle;
  inputTextStyles?: TextStyle;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DateInput: FC<IDateInput> = ({
  label,
  inputRoot,
  name,
  handler,
  errorStyle,
  inputTextStyles,
  minimumDate,
  maximumDate,
}) => {
  const [picker, setPicker] = useState(false);
  return (
    <Controller
      control={handler.control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => {
        console.log('🎫 DateInput render - fieldState.error:', fieldState.error);
        console.log('🎫 DateInput render - fieldState.error.message:', fieldState.error?.message);
        return (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => setPicker(true)}
              style={{ ...styles.inputRoot, ...inputRoot }}
            >
              <ScalableText
                fontFamily="Regular"
                style={{ ...styles.textInput, ...inputTextStyles }}
              >
                {value && value !== null && value !== "" ? moment(value).format("DD-MM-YY") : label}
              </ScalableText>
            </TouchableOpacity>
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
            <DatePicker
              {...(minimumDate ? { minimumDate } : {})}
              {...(maximumDate ? { maximumDate } : {})}
              mode="date"
              modal
              open={picker}
              date={value && value !== null ? new Date(value) : (maximumDate || new Date())}
              onConfirm={(date) => {
                setPicker(false);
                onChange(date);
              }}
              onCancel={() => {
                setPicker(false);
              }}
              title={"Select date"}
            />
          </View>
        );
      }}
    />
  );
};

export default memo(DateInput);

const styles = StyleSheet.create({
  inputRoot: {
    color: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    elevation: 4,
    height: 40,
    justifyContent: "center",
    width: "100%",
  },
  textInput: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
    marginTop: 0,
  },
});
