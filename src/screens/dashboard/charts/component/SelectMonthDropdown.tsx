import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, useMemo } from "react";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import SelectDropdown from "react-native-select-dropdown";
import { COLORS } from "../../../../colors";
import moment from "moment";

interface ISelectMonthDropdown {
  onChange: (e: number) => void;
  value: number | undefined;
}

const SelectMonthDropdown: FC<ISelectMonthDropdown> = ({ onChange, value }) => {
  const monthsMenu = useMemo(() => {
    const months = moment.months(); // Array of month names

    return months.map((month, index) => ({
      label: month,
      value: index + 1,
    }));
  }, []);

  return (
    <SelectDropdown
      data={monthsMenu}
      onSelect={(value) => {
        onChange(value.value);
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
      renderButton={(selectedItem) => (
        <TouchableOpacity style={styles.dropDownRoot}>
          <ScalableText style={styles.dropdownText} fontFamily="Medium">
            {value !== undefined && selectedItem?.value
              ? selectedItem.label
              : "Month"}
          </ScalableText>
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            <AutoHeightImage width={10} source={IMAGES.gridiconDropdownIcon} />
          </View>
        </TouchableOpacity>
      )}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};

export default SelectMonthDropdown;

const styles = StyleSheet.create({
  dropDownRoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 50,
    marginLeft: 5,
    borderWidth: 0.5,
    padding: 3,
    borderRadius: 3,
    borderColor: "#DBD8D8",
  },
  dropdownText: {
    fontSize: 9,
    marginTop: 0,
  },
  dropdownMenuStyle: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    paddingHorizontal: 5,
    marginTop: 5,
    minWidth: 60,
    paddingVertical: 5,
  },
  dropdownItemStyle: {
    flexDirection: "row",
    width: 150,
  },
  dropdownItemTxtStyle: {
    fontSize: 9,
    color: "#6F6F6F",
    marginVertical: 3,
  },
});
