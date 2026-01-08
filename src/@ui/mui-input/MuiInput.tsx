import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS } from "../../colors";

import { Controller, UseFormReturn } from "react-hook-form";
import ScalableText from "../scalable-text/ScalableText";

interface MuiInputProps extends TextInputProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
  containerStyles?: ViewStyle;
  inputStyles?: TextStyle;
  inputRoot?: ViewStyle;
  errorStyle?: TextStyle;
}

const MuiInput: React.FC<MuiInputProps> = ({
  label,
  placeholder,
  style,
  handler,
  name,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { watch } = handler;
  const value = watch(name);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedLabel]);

  const labelStyle = {
    position: "absolute" as const,
    left: 15,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 10],
    }),
    zIndex: 100,
    backgroundColor: "white",
    paddingHorizontal: 5,
  };

  const labelText = {
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: ["#888888", "#888888"],
    }),
  };

  return (
    <Controller
      name={name}
      control={handler.control}
      render={({
        field: { onChange, value: inputValue, onBlur },
        fieldState: { error },
      }) => (
        <View style={{ width: "100%" }}>
          <View style={[styles.container, style]}>
            <Animated.View style={labelStyle}>
              <Animated.Text style={labelText}>{label}</Animated.Text>
            </Animated.View>
            <TextInput
              style={[styles.input]}
              value={inputValue}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor="#aaa"
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(Boolean(value));
                onBlur();
              }}
              {...rest}
            />
          </View>
          {error && (
            <ScalableText fontFamily="Regular" style={styles.errorText}>
              {error.message}
            </ScalableText>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 6,
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    fontSize: 14,
    paddingHorizontal: 20,
    color: COLORS.black,
    borderRadius: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 11,
  },
});

export default MuiInput;
