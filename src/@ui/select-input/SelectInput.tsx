import { StyleSheet, View, ViewStyle } from "react-native";
import React, { FC, memo } from "react";
import SelectDropdown from "react-native-select-dropdown";

import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import ScalableText from "../scalable-text/ScalableText";
import { COLORS } from "../../colors";

interface ISelectInput {
  label: string;
  options: { label: string; value: string }[];
  onChange: (e: string) => void;
  dropdownButtonStyle?: ViewStyle;
  value: string;
}

const SelectInput: FC<ISelectInput> = ({
  label,
  options,
  onChange,
  dropdownButtonStyle,
  value = "",
}) => {
  return (
    <SelectDropdown
      defaultValue={value}
      data={options}
      onSelect={(selectedItem) => {
        onChange(selectedItem.value);
      }}
      renderButton={(selectedItem) => {
        return (
          <View
            style={{ ...styles.dropdownButtonStyle, ...dropdownButtonStyle }}
          >
            <ScalableText
              fontFamily="Regular"
              style={styles.dropdownButtonTxtStyle}
              numberOfLines={1}
            >
              {selectedItem?.value || label}
            </ScalableText>
            <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
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
              fontFamily="Regular"
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

export default memo(SelectInput);

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    color: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    elevation: 4,
    height: 41,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: 8,
    width: "100%",
  },
  dropdownButtonTxtStyle: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#717171",
    marginTop: 0,
    marginRight: 5,
    textTransform: "capitalize",
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
    paddingHorizontal: 2,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",

    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  dropdownItemTxtStyle: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#717171",
    marginTop: 0,
    textTransform: "capitalize",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
