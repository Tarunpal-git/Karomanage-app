import React, { useRef, useEffect, useState } from "react";
import { Text, StyleSheet, Animated, TextStyle } from "react-native";
import { COLORS } from "../../colors";

interface AnimatedCounterProps {
  endValue: number;
  duration: number;
  textStyles?: TextStyle;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  endValue,
  duration,
  textStyles,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    const listenerId = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });

    Animated.timing(animatedValue, {
      toValue: endValue,
      duration: duration,
      useNativeDriver: false, // Set to false because we're animating text
    }).start();

    // Clean up the listener on unmount
    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [animatedValue, endValue, duration]);

  return (
    <Text style={{ ...styles.counterText, ...textStyles }}>
      {displayValue.toLocaleString("en-US")}
    </Text>
  );
};

const styles = StyleSheet.create({
  counterText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: COLORS.black,
    marginTop: 3,
  },
});

export default AnimatedCounter;
