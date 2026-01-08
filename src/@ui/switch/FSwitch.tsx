import { StyleSheet, Text, TouchableOpacity, Animated } from "react-native";
import React, { FC, useEffect, useRef } from "react";
import { COLORS } from "../../colors";

interface IFSwitch {
  onChange: (e: boolean) => void;
  value: boolean;
  showLabels?: boolean;
  disabled?: boolean;
}

const FSwitch: FC<IFSwitch> = ({
  onChange,
  value,
  showLabels = true,
  disabled,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleSwitch = () => {
    onChange(!value);
    // Configure the animation
    Animated.timing(slideAnim, {
      toValue: value ? 0 : 1,
      duration: 300, // You can adjust the duration as needed
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (value) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300, // You can adjust the duration as needed
        useNativeDriver: false,
      }).start();
    }
  }, [value]);

  const switchTextStyles = {
    transform: [
      {
        translateX: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 23], // Adjust the distance to slide
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={1}
      style={[
        styles.root,
        value ? { backgroundColor: "#40B600" } : { backgroundColor: "#fff" },
      ]}
      onPress={toggleSwitch}
    >
      {showLabels && (
        <>
          <Text style={{ ...styles.switchText, color: COLORS.white }}>YES</Text>
          <Text
            style={{
              ...styles.switchText,
              color: value ? "transparent" : "#8E8E8E",
            }}
          >
            NO
          </Text>
        </>
      )}

      <Animated.View
        style={[
          styles.switchToggler,
          value
            ? { backgroundColor: COLORS.white }
            : { backgroundColor: "#8E8E8E" },
          switchTextStyles,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#40B600",
    height: 20,
    borderRadius: 80,
    width: 46,
    justifyContent: "space-evenly",
    elevation: 2,
  },
  switchText: {
    color: "#8E8E8E",
    fontSize: 10,
  },
  switchToggler: {
    width: 14,
    height: 14,
    position: "absolute",
    backgroundColor: "#8E8E8E",
    borderRadius: 50,
    right: 4,
    left: 5,
  },
});

export default FSwitch;
