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
import SelectDropdown from "react-native-select-dropdown";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../../colors";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";
import Flex from "../../../../../@ui/flex/Flex";
import { TImages } from "../../../../../images/images";

interface FieldTypeSelectProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
  containerStyles?: ViewStyle;
  inputStyles?: TextStyle;
  inputRoot?: ViewStyle;
  errorStyle?: TextStyle;
  options: { label: string; value: TFormField["type"]; icon: TImages }[];
  defaultValue?: { label: string; value: TFormField["type"]; icon: TImages };
}

const FieldTypeSelect: React.FC<FieldTypeSelectProps> = ({
  label,
  inputRoot,
  handler,
  name,
  options,
  containerStyles,
  defaultValue,
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
      outputRange: [28, 10],
    }),
    zIndex: 100,
    backgroundColor: "white",
    paddingHorizontal: 5,
  };

  const labelText = {
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 12],
    }),
    color: "#717171",
  };

  return (
    <Controller
      name={name}
      control={handler.control}
      render={({ field: { onChange, onBlur }, fieldState: { error } }) => (
        <View style={{ flex: 1 }}>
          <SelectDropdown
            defaultValue={defaultValue}
            ref={dropdownRef}
            data={[...options]}
            onSelect={(selectedItem) => {
              onChange(selectedItem.value);
            }}
            renderButton={(selectedItem) => {
              return (
                <View style={{ ...styles.container, ...containerStyles }}>
                  <Animated.View style={labelStyle}>
                    <Animated.Text style={labelText}>{label}</Animated.Text>
                  </Animated.View>
                  <TouchableOpacity
                    activeOpacity={1}
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
                    <ScalableText
                      fontFamily="Medium"
                      style={{ fontSize: 11, color: "#5D5D5D" }}
                    >
                      {selectedItem ? selectedItem.label : ""}
                    </ScalableText>
                    <Flex mt={3}>
                      <AutoHeightImage
                        source={IMAGES.chevronDownIcon}
                        width={8}
                      />
                    </Flex>
                  </TouchableOpacity>
                </View>
              );
            }}
            renderItem={(item) => {
              return (
                <View style={styles.dropdownItemStyle}>
                  <AutoHeightImage
                    source={IMAGES[item.icon as TImages]}
                    width={10}
                  />
                  <ScalableText
                    fontFamily="Medium"
                    style={styles.dropdownItemTxtStyle}
                  >
                    {item.label}
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
    paddingBottom: 10,
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: COLORS.primary,
    borderWidth: 1,
    fontSize: 14,
    paddingHorizontal: 20,
    color: COLORS.black,
    borderRadius: 4,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dropdownItemTxtStyle: {
    fontSize: 11,

    color: "#717171",
    marginTop: 3,
    marginLeft: 10,
  },
});

export default FieldTypeSelect;
