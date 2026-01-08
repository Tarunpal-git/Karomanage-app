import { StyleSheet, View, ViewStyle, TextInput, TouchableOpacity, ScrollView, Platform, Dimensions } from "react-native";
import React, { FC, memo, useState, useRef } from "react";
import SelectDropdown from "react-native-select-dropdown";

import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import ScalableText from "../scalable-text/ScalableText";
import { COLORS } from "../../colors";
import { Controller, UseFormReturn } from "react-hook-form";

interface IHybridInput {
  label: string;
  options: { label: string; value: string }[];
  onChangeValue?: (e: string) => void;
  dropdownButtonStyle?: ViewStyle;
  value: { label: string; value: string };
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
  placeholder?: string;
  onDropdownOpen?: () => void;
  onDropdownClose?: () => void;
}

const HybridInput: FC<IHybridInput> = ({
  label,
  options,
  onChangeValue,
  dropdownButtonStyle,
  value,
  handler,
  name,
  placeholder,
  onDropdownOpen,
  onDropdownClose,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value?.label || '');
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const inputRef = useRef<View>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      // Calculate position when opening dropdown
      inputRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const screenHeight = Dimensions.get('window').height;
        const spaceBelow = screenHeight - (pageY + height);
        const spaceAbove = pageY;
        
        if (spaceBelow < 200 && spaceAbove > spaceBelow) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      });
      onDropdownOpen?.();
    } else {
      onDropdownClose?.();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (option: { label: string; value: string }) => {
    setInputValue(option.label);
    handler.setValue(name, option.value);
    onChangeValue?.(option.value);
    setIsDropdownOpen(false);
    onDropdownClose?.();
  };

  return (
    <Controller
      name={name}
      control={handler.control}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <View style={styles.container} ref={inputRef}>
          <View style={{ ...styles.dropdownButtonStyle, ...dropdownButtonStyle }}>
            <TextInput
              style={styles.textInput}
              placeholder={placeholder || label}
              placeholderTextColor="#717171"
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                onChange(text);
                setIsDropdownOpen(true);
                onDropdownOpen?.();
              }}
              onFocus={() => {
                setIsDropdownOpen(true);
                onDropdownOpen?.();
              }}
            />
            <TouchableOpacity
              style={styles.dropdownArrow}
              onPress={handleDropdownToggle}
              activeOpacity={0.7}
            >
              <AutoHeightImage source={IMAGES.chevronDownIcon} width={10} />
            </TouchableOpacity>
          </View>
          
          {isDropdownOpen && filteredOptions.length > 0 && (
            <View 
              style={[
                styles.dropdownContainer,
                dropdownPosition === 'top' ? styles.dropdownTop : styles.dropdownBottom,
                { zIndex: 9999, elevation: Platform.OS === 'android' ? 9999 : undefined }
              ]}
            >
              <ScrollView 
                style={styles.dropdownScroll} 
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {filteredOptions.map((option, index) => {
                  const isSelected = value?.value === option.value;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dropdownItem,
                        {
                          backgroundColor: isSelected ? COLORS.lighterBlue : 'transparent',
                        }
                      ]}
                      onPress={() => handleOptionSelect(option)}
                      activeOpacity={0.7}
                    >
                      <ScalableText 
                        style={{
                          ...styles.dropdownItemText,
                          color: isSelected ? COLORS.primary : COLORS.black
                        }} 
                        fontFamily={isSelected ? "Medium" : "Regular"}
                      >
                        {option.label}
                      </ScalableText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
          
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

export default memo(HybridInput);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
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
  textInput: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
    marginTop: 0,
    marginRight: 5,
    flex: 1,
  },
  dropdownArrow: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
    minWidth: '100%',
    zIndex: 9999,
    ...(Platform.OS === 'android' && {
      elevation: 9999,
    }),
  },
  dropdownTop: {
    bottom: '100%',
    marginBottom: 4,
  },
  dropdownBottom: {
    top: '100%',
    marginTop: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
    marginTop: 0,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 11,
  },
}); 