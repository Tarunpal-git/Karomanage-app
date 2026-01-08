import { StyleSheet, Dimensions } from "react-native";
import React, { FC, memo } from "react";
// import Card from "../../../@ui/card/Card";
import Flex from "../../../@ui/flex/Flex";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { TImages } from "../../../images/images";
import AnimatedCounter from "../../../@ui/animated-views/AnimatedCounter";
import { COLORS } from "../../../colors";

const { width } = Dimensions.get("window");

interface IDashboardCard {
  icon: TImages;
  count: number;
  title: string;
  prefix?: React.ReactNode;
}

const DashboardCard: FC<IDashboardCard> = ({ count, icon, title, prefix }) => {
  return (
    <Flex styles={styles.featureCard} flexDirection="row" align="flex-start">
      <AutoHeightImage source={IMAGES[icon]} width={width * 0.1} />
      <Flex flexDirection="column" align="flex-start" ml={width * 0.04}>
        <Flex flexWrap="nowrap">
          {prefix}
          <AnimatedCounter duration={1000} endValue={count} />
        </Flex>

        <ScalableText style={styles.title} fontFamily="Medium">
          {title}
        </ScalableText>
      </Flex>
    </Flex>
  );
};

export default memo(DashboardCard);

const styles = StyleSheet.create({
  featureCard: {
    width: "100%", // Adjust width to fit within a grid layout
    borderRadius: 10,
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
    marginVertical: width * 0.02,
   backgroundColor: COLORS.white,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 10,
  },
  count: {
    fontSize: width * 0.04, // Dynamic font size
    
  },
  title: {
    fontSize: width * 0.025, // Dynamic font size for small text
    color: "#A0A0A0",


  },
});
