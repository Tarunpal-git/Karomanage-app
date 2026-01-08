import React, { FC, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { interpolatePath } from "react-native-redash";
 
import TabItem from "./TabItem";
import AnimatedCircle from "./AnimatedCircle";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
 
import usePath from "../../utils/hooks/usePath";
import { getPathXCenter } from "../../utils/Path";
import { SCREEN_WIDTH } from "../../constants/Screen";
import { COLORS } from "../../colors";
import { TImages } from "../../images/images";
import { hasAnyPermission } from "../../utils/fetchPermissionsTitle";
 
const AnimatedPath = Animated.createAnimatedComponent(Path);
export const CustomBottomTab: FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const { containerPath, curvedPaths, tHeight } = usePath();
  const circleXCoordinate = useSharedValue(0);
  const progress = useSharedValue(1);
 
  // Dynamically generate footer paths based on permissions
  const footerPaths = useMemo(() => {
    const paths = ["HomeStack"];
    
    if (hasAnyPermission("Expenses")) {
      paths.push("ExpensesStack");
    }
    
    paths.push("NotificationsStack");
    
    if (hasAnyPermission("Attendance")) {
      paths.push("AttendanceStack");
    }
    
    paths.push("ProfileStack");
    
    return paths;
  }, []);
 
  const handleMoveCircle = (currentPath: string) => {
    circleXCoordinate.value = getPathXCenter(currentPath);
  };
 
  const selectIcon = (routeName: string) => {
    switch (routeName) {
      case "HomeStack":
        return {
          iconName: "footerHome",
          iconSize: 21,
        };
      case "ExpensesStack":
        return {
          iconName: "footerExpense",
          iconSize: 21,
        };
        case "NotificationsStack":
          return {
            iconName: "footerBell",
            iconSize: 22,
          };
      case "AttendanceStack":
        return {
          iconName: "footerAttendance",
          iconSize: 23,
        };
        case "ProfileStack":
          return {
            iconName: "footerUser",
            iconSize: 21,
          };
       
      default:
        return {
          iconName: "footerHome",
          iconSize: 21,
        };
    }
  };
  const animatedProps = useAnimatedProps(() => {
    const currentPath = interpolatePath(
      progress.value,
      Array.from({ length: curvedPaths.length }, (_, index) => index + 1),
      curvedPaths
    );
 
    runOnJS(handleMoveCircle)(currentPath);
    return {
      d: `${containerPath} ${currentPath}`,
    };
  });
 
  const handleTabPress = (index: number, tab: string) => {
    if (tab === "HomeStack") {
      navigation.navigate("Home");
    } else {
      navigation.navigate(tab);
    }
    progress.value = withTiming(index);
  };
 
  useEffect(() => {
    progress.value = withTiming(state.index + 1);
  }, [state.index]);
 
  return (
    <View style={styles.tabBarContainer}>
      <Svg width={SCREEN_WIDTH} height={tHeight} style={styles.shadowMd}>
        <AnimatedPath fill={COLORS.primary} animatedProps={animatedProps} />
      </Svg>
      <AnimatedCircle circleX={circleXCoordinate} />
      <View
        style={[
          styles.tabItemsContainer,
          {
            height: tHeight,
          },
        ]}
      >
        {footerPaths.map((route, index) => (
          <TabItem
            key={route}
            iconName={selectIcon(route).iconName as TImages}
            activeIndex={state.index + 1}
            index={index}
            onTabPress={() => handleTabPress(index + 1, route)}
            iconSize={selectIcon(route).iconSize}
          />
        ))}
      </View>
    </View>
  );
};
export default CustomBottomTab;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 2,
  },
  tabItemsContainer: {
    position: "absolute",
    flexDirection: "row",
    width: "100%",
  },
  shadowMd: {
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
  },
});