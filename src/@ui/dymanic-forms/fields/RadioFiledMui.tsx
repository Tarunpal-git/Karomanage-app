import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import ScalableText from "../../scalable-text/ScalableText";
import Flex from "../../flex/Flex";
import { COLORS } from "../../../colors";
import { Controller, UseFormReturn } from "react-hook-form";

interface RadioOption {
  name: string;
}

interface IRadioFiledMui {
  options: RadioOption[];
  onSelect?: (value: string) => void;
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
  errorStyle?: TextStyle;
  containerStyles?: ViewStyle;
}

const RadioFiledMui: React.FC<IRadioFiledMui> = ({
  options,
  onSelect,
  handler,
  label,
  name,
  errorStyle,
  containerStyles,
}) => {
  return (
    <Controller
      name={name}
      control={handler.control}
      render={({
        field: { onChange, value: inputValue },
        fieldState: { error },
      }) => (
        <Flex
          flexDirection="column"
          w={"100%"}
          align="flex-start"
          styles={containerStyles}
        >
          <ScalableText fontFamily="Regular" style={styles.labelText}>
            {label}
          </ScalableText>
          <Flex styles={styles.container}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => {
                  onChange(option.name);
                  onSelect?.(option.name);
                }}
              >
                <View
                  style={{
                    ...styles.radioSelected,
                  }}
                >
                  {inputValue === option.name && (
                    <View
                      style={{
                        backgroundColor: COLORS.primary,
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                      }}
                    />
                  )}
                </View>
                <ScalableText fontFamily="Regular" style={styles.label}>
                  {option.name}
                </ScalableText>
              </TouchableOpacity>
            ))}
          </Flex>
          {error && (
            <ScalableText
              fontFamily="Regular"
              style={{ ...styles.errorText, ...errorStyle }}
            >
              {error.message}
            </ScalableText>
          )}
        </Flex>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    width: "100%",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginRight: 15,
  },
  label: {
    fontSize: 14,
  },
  radioSelected: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.black,
    marginRight: 5,

    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    fontSize: 14,
    color: "#888888",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 11,
  },
});

export default RadioFiledMui;
