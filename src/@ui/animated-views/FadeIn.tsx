import { Animated, FlexStyle, ViewStyle } from "react-native";
import React, { useCallback, useEffect, useRef } from "react";

interface IFadeIn {
  children: React.ReactNode;
  flexDirection?: FlexStyle["flexDirection"];
  align?: FlexStyle["alignItems"];
  justify?: FlexStyle["justifyContent"];
  mr?: FlexStyle["marginRight"];
  ml?: FlexStyle["marginLeft"];
  mt?: FlexStyle["marginTop"];
  mb?: FlexStyle["marginBottom"];
  mx?: FlexStyle["marginHorizontal"];
  my?: FlexStyle["marginHorizontal"];
  styles?: ViewStyle;
  flex?: number;
  delay?: number;
}

const FadeIn: React.FC<IFadeIn> = ({
  children,

  flexDirection = "row",
  align = "center",
  justify,
  mb,
  ml,
  mr,
  mt,
  mx,
  my,
  styles,
  flex,
  delay = 1200,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = useCallback(() => {
    // Will change fadeAnim value to 1 after the specified delay
    const delayTimeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: delay,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(delayTimeout); // Clean up the timeout on unmount or re-render
  }, [fadeAnim, delay]);

  useEffect(() => {
    fadeIn();
  }, [fadeIn]);

  return (
    <Animated.View
      style={[
        {
          // Bind opacity to animated value
          opacity: fadeAnim,
          flexDirection,
          flex,
          alignItems: align,
          justifyContent: justify,
          marginLeft: ml,
          marginRight: mr,
          marginTop: mt,
          marginBottom: mb,
          marginHorizontal: mx,
          marginVertical: my,
          ...styles,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FadeIn;
