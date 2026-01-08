import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";

import { Controller, UseFormReturn } from "react-hook-form";
import ScalableText from "../../scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import SelectDropdown from "react-native-select-dropdown";

interface SelectFieldMuiProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
  containerStyles?: ViewStyle;
  inputStyles?: TextStyle;
  inputRoot?: ViewStyle;
  errorStyle?: TextStyle;
  options: { name: string }[];
}

const SelectFieldMui: React.FC<SelectFieldMuiProps> = ({
  label,
  inputRoot,
  handler,
  name,
  options,
  containerStyles,

  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { watch } = handler;
  const value = watch(name);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;
  const dropdownRef = useRef<SelectDropdown>(null);

  const openDropdown = () => {
    dropdownRef.current?.openDropdown();
  };

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
    color: "#888888",
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
          <SelectDropdown
            ref={dropdownRef}
            defaultValue={inputValue ? { name: inputValue } : null}
            data={[...options]}
            onSelect={(selectedItem) => {
              onChange(selectedItem.name);
            }}
            renderButton={(selectedItem) => {
              return (
                <View style={{ ...styles.container, ...containerStyles }}>
                  <Animated.View style={labelStyle}>
                    <Animated.Text style={labelText}>{label}</Animated.Text>
                  </Animated.View>
                  <TouchableOpacity
                    style={{ ...styles.input, ...inputRoot }}
                    onPress={() => {
                      setIsFocused(!isFocused);
                      openDropdown();
                    }}
                    onBlur={() => {
                      setIsFocused(Boolean(value));
                      onBlur();
                    }}
                  >
                    <ScalableText fontFamily="Regular">
                      {selectedItem ? selectedItem.name : ""}
                    </ScalableText>
                  </TouchableOpacity>
                </View>
              );
            }}
            renderItem={(item) => {
              return (
                <View style={styles.dropdownItemStyle}>
                  <ScalableText
                    fontFamily="Regular"
                    style={styles.dropdownItemTxtStyle}
                  >
                    {item.name}
                  </ScalableText>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
            dropdownOverlayColor="transparent"
            {...rest}
          />
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
    width: "100%",
    justifyContent: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 11,
  },
  dropdownMenuStyle: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#C8C8C8",
  },
  dropdownItemTxtStyle: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#717171",
  },
});

export default SelectFieldMui;
