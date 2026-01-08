import { StyleSheet, View, ViewStyle, Dimensions } from "react-native";
import React, { FC, memo, useRef, useState } from "react";
import SelectDropdown from "react-native-select-dropdown";

import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import ScalableText from "../scalable-text/ScalableText";
import { COLORS } from "../../colors";
import { Controller, UseFormReturn } from "react-hook-form";

interface IControlledSelect {
  label: string;
  options: { label: string; value: string }[];
  onChangeValue?: (e: string) => void;
  dropdownButtonStyle?: ViewStyle;
  value: { label: string; value: string };
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
  disabled?: boolean;
}

const ControlledSelect: FC<IControlledSelect> = ({
  label,
  options,
  onChangeValue,
  dropdownButtonStyle,
  value,
  handler,
  name,
  disabled = false,
}) => {
  const dropdownRef = useRef<any>(null);
  const [buttonWidth, setButtonWidth] = useState(0);

  const onButtonLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setButtonWidth(width);
  };

  // Calculate responsive dropdown width
  const getDropdownWidth = () => {
    const screenWidth = Dimensions.get('window').width;
    const minWidth = 200;
    const maxWidth = screenWidth - 40; // 20px margin on each side
    
    if (buttonWidth === 0) return '100%';
    if (buttonWidth < minWidth) return minWidth;
    if (buttonWidth > maxWidth) return maxWidth;
    return buttonWidth;
  };

  return (
    <Controller
      name={name}
      control={handler.control}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <View style={{ flex: 1 }}>
          <SelectDropdown
            ref={dropdownRef}
            defaultValue={value}
            data={options}
            disabled={disabled}
            onSelect={(selectedItem) => {
              if (!disabled) {
                onChange(selectedItem.value);
                onChangeValue?.(selectedItem.value);
              }
            }}
            renderButton={(selectedItem) => {
              return (
                <View
                  style={{
                    ...styles.dropdownButtonStyle,
                    ...dropdownButtonStyle,
                    ...(disabled && styles.disabledButton),
                  }}
                  onLayout={onButtonLayout}
                >
                  <ScalableText
                    fontFamily="Regular"
                    style={{
                      ...styles.dropdownButtonTxtStyle,
                      color: selectedItem?.label ? COLORS.black : "#717171",
                      ...(disabled && styles.disabledText),
                    }}
                    numberOfLines={1}
                  >
                    {selectedItem?.label || label}
                  </ScalableText>
                  <AutoHeightImage 
                    source={IMAGES.chevronDownIcon}
                    width={10} 
                    styles={disabled ? styles.disabledIcon : undefined}
                  />
                </View>
              );
            }}
            renderItem={(item) => {
              const isSelected = value?.value === item.value;
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    backgroundColor: isSelected ? COLORS.lighterBlue : 'transparent',
                  }}
                >
                  <ScalableText
                    fontFamily={isSelected ? "Medium" : "Regular"}
                    style={{
                      ...styles.dropdownItemTxtStyle,
                      color: isSelected ? COLORS.primary : COLORS.black,
                    }}
                  >
                    {item.label}
                  </ScalableText>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={{
              ...styles.dropdownMenuStyle,
              width: getDropdownWidth(),
            }}
            dropdownOverlayColor="transparent"
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

export default memo(ControlledSelect);

const styles = StyleSheet.create({
  dropdownButtonStyle: {
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownButtonTxtStyle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
    marginTop: 0,
    marginRight: 5,
    flex: 1,
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
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // borderWidth: 1,
    // borderColor: COLORS.border,
    zIndex: 1000,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  dropdownItemTxtStyle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
    marginTop: 0,
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 11,
    marginTop: 4,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: COLORS.whiteSmoke,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  disabledText: {
    color: COLORS.muted,
  },
  disabledIcon: {
    opacity: 0.5,
  },
});
