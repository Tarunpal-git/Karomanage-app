import React, { useEffect, useRef, memo } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../colors";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: boolean) => void;
  size?: number;
  rounded?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  disabled = true,
  onChange,
  size = 15,
  rounded,
}) => {
  const backgroundColorValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(backgroundColorValue, {
      toValue: checked ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [checked]);

  const backgroundColor = backgroundColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", COLORS.primary],
  });

  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.container}
      onPress={() => onChange?.(!checked)}
    >
      <Animated.View
        style={[
          styles.checkbox,
          {
            backgroundColor,
            width: size,
            height: size,
            borderRadius: rounded ? 20 : 4,
          },
        ]}
      >
        <View
          style={{ ...styles.checkboxOutline, borderRadius: rounded ? 20 : 4 }}
        />
      </Animated.View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderRadius: 4,
  },
  checkboxOutline: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  label: {
    fontSize: 16,
  },
});

export default memo(Checkbox);
