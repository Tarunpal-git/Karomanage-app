import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { COLORS } from "../../colors";

interface CollapsibleProps {
  children: React.ReactNode;
  isCollapsed: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({ children, isCollapsed }) => {
  const animatedHeight = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isCollapsed ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isCollapsed]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            height: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 130], // adjust 150 to the desired max height
            }),
            overflow: "hidden",
            padding: isCollapsed ? 5 : 0,
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: COLORS.white,
  },
  content: {
    padding: 5,
  },
});

export default Collapsible;
