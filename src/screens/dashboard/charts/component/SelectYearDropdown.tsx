import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, useMemo } from "react";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import SelectDropdown from "react-native-select-dropdown";
import { COLORS } from "../../../../colors";

interface ISelectYearDropdown {
  onChange: (e: number) => void;
  sort?: "ascending" | "descending";
}

const SelectYearDropdown: FC<ISelectYearDropdown> = ({
  onChange,
  sort = "descending",
}) => {
  const yearsMenu = useMemo(() => {
    const currentYear = new Date().getFullYear();

    const lastFiveYears: { label: string; value: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const year = sort === "descending" ? currentYear - i : currentYear + i;
      lastFiveYears.push({ label: `${year}`, value: year });
    }

    return lastFiveYears;
  }, []);

  return (
    <SelectDropdown
      data={yearsMenu}
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
            {selectedItem?.value ? selectedItem.label : "Year"}
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

export default SelectYearDropdown;

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
    paddingVertical: 5,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
  },
  dropdownItemTxtStyle: {
    fontSize: 10,
    color: "#6F6F6F",
    marginVertical: 3,
  },
});
