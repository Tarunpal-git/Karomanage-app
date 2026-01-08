import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";
import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import ScalableText from "../scalable-text/ScalableText";
import { IMAGES } from "../../images";
import { Easing } from "react-native-reanimated";
import { COLORS } from "../../colors";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  headerContainerStyles?: ViewStyle;
  headerTextStyles?: TextStyle;
  bodyStyles?: ViewStyle;
  bodyContentStyles?: ViewStyle;
  contentHeight: number;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  headerContainerStyles,
  headerTextStyles,
  bodyContentStyles,
  bodyStyles,
  contentHeight = 200,
}) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight], // Adjust this value based on your content height
  });

  const rotateValue = useRef(new Animated.Value(0)).current;

  const animateRotation = (toValue: number) => {
    Animated.timing(rotateValue, {
      toValue,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateRotation(expanded ? 1 : 0);
  }, [expanded]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ ...styles.dropdownButtonStyle, ...headerContainerStyles }}
        onPress={() => setExpanded(!expanded)}
      >
        <ScalableText
          fontFamily="SemiBold"
          style={{ ...styles.dropdownButtonTxtStyle, ...headerTextStyles }}
          numberOfLines={1}
        >
          {title}
        </ScalableText>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <AutoHeightImage source={IMAGES.chevronDownIcon} width={11} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[{ ...styles.body, ...bodyStyles }, { height }]}>
        <View style={{ ...styles.bodyContent, ...bodyContentStyles }}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // width: "100%",
  },
  titleContainer: {
    backgroundColor: "#f1f1f1",
    // padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    overflow: "hidden",
    elevation: 4,
    backgroundColor: COLORS.white,
  },
  bodyContent: {},
  dropdownButtonStyle: {
    color: COLORS.border,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    elevation: 2,
    minHeight: 59,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    position: "relative",
    marginBottom: 7,
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    color: "#1B1A1A",
    marginTop: 5,
    marginRight: 5,
    textTransform: "capitalize",
  },
});

export default Accordion;
