import { StyleSheet } from "react-native";
import React, { FC } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { COLORS } from "../../colors";
type CircleProps = {
  circleX: SharedValue<number>;
};
const circleContainerSize = 54;
 
const AnimatedCircle: FC<CircleProps> = ({ circleX }) => {
  const circleContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: circleX.value - circleContainerSize / 2 }],
    };
  }, []);
 
  return <Animated.View style={[circleContainerStyle, styles.container]} />;
};
 
export default AnimatedCircle;
 
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -circleContainerSize / 1.6,
    width: circleContainerSize,
    left: 0,
    borderRadius: circleContainerSize,
    height: circleContainerSize,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});