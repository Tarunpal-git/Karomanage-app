import {
  StyleSheet,
  View,
  ViewStyle,
  Animated,
  Easing,
  TextStyle,
} from "react-native";
import React, { FC, memo, useRef } from "react";
import Dropdown from "react-native-select-dropdown";

import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import ScalableText from "../scalable-text/ScalableText";
import { COLORS } from "../../colors";

interface ISelectDropdown {
  label: string;
  options: TSelectOptions[];
  onChange: (e: string) => void;
  dropdownButtonStyle?: ViewStyle;
  dropdownButtonTxtStyle?: TextStyle;
  value: TSelectOptions;
}

const SelectDropdown: FC<ISelectDropdown> = ({
  label,
  options,
  onChange,
  dropdownButtonStyle,
  value,
  dropdownButtonTxtStyle,
}) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const animateRotation = (toValue: number) => {
    Animated.timing(rotateValue, {
      toValue,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Dropdown
      defaultValue={value}
      data={options}
      onSelect={(selectedItem) => {
        onChange(selectedItem.value);
      }}
      renderButton={(selectedItem, isOpened) => {
        animateRotation(isOpened ? 0 : 1);
        return (
          <View
            style={{ ...styles.dropdownButtonStyle, ...dropdownButtonStyle }}
          >
            <ScalableText
              fontFamily="Medium"
              style={{
                ...styles.dropdownButtonTxtStyle,
                ...dropdownButtonTxtStyle,
              }}
              numberOfLines={1}
            >
              {selectedItem?.label || label}
            </ScalableText>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <AutoHeightImage
                source={IMAGES.gridiconDropdownIcon}
                width={24}
              />
            </Animated.View>
          </View>
        );
      }}
      renderItem={(item) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
            }}
          >
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
    />
  );
};

export default memo(SelectDropdown);

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    color: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    elevation: 4,
    height: 49,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: 8,
    width: "100%",
  },
  dropdownButtonTxtStyle: {
    fontSize: 14,
    color: "#1A1919",
    marginTop: 5,
    marginRight: 5,
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    padding: 10,
  },
  dropdownItemTxtStyle: {
    fontSize: 14,
    color: "#6F6F6F",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
