import { Pressable } from "react-native";
import React, { FC, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
 
import usePath from "../../utils/hooks/usePath";
import { getPathXCenterByIndex } from "../../utils/Path";
 
import { IMAGES } from "../../images";
import { TImages } from "../../images/images";
 
export type TabProps = {
  iconName: TImages;
  iconSize: number;
  index: number;
  activeIndex: number;
  onTabPress: () => void;
};
const ICON_SIZE = 21;
 
const TabItem: FC<TabProps> = ({
  iconName,
  index,
  activeIndex,
  onTabPress,
  iconSize,
}) => {
  const { curvedPaths } = usePath();
  const animatedActiveIndex = useSharedValue(activeIndex);
  const iconPosition = getPathXCenterByIndex(curvedPaths, index);
 
  const tabStyle = useAnimatedStyle(() => {
    const translateY = animatedActiveIndex.value - 1 === index ? -20 : 20;
    const iconPositionX = iconPosition - index * ICON_SIZE;
    const devisor = activeIndex === 3 ? 1.7 : 2;
 
    return {
      width: ICON_SIZE,
      height: ICON_SIZE,
      transform: [
        { translateY: withTiming(translateY + 2) },
        { translateX: withTiming(iconPositionX - ICON_SIZE / devisor) },
      ],
    };
  });
 
  const iconColor = useSharedValue(
    activeIndex === index + 1 ? "white" : "#fff"
  );
 
  //Adjust Icon color for this first render
  useEffect(() => {
    animatedActiveIndex.value = activeIndex;
    iconColor.value = withTiming("#fff");
  }, [activeIndex]);
 
  return (
    <Animated.View style={[tabStyle]}>
      <Pressable
        //Increasing touchable Area
        hitSlop={{ top: 10, bottom: 30, left: 50, right: 50 }}
        onPress={onTabPress}
      >
        <Animated.Image
          source={IMAGES[iconName]}
          style={{
            width: iconSize,
            height: iconSize,
          }}
        />
      </Pressable>
    </Animated.View>
  );
};
 
export default TabItem;