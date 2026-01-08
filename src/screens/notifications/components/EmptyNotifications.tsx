import { StyleSheet } from "react-native";
import React, { memo } from "react";
import Center from "../../../@ui/center/Center";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import Flex from "../../../@ui/flex/Flex";
import { COLORS } from "../../../colors";

const EmptyNotifications = () => {
  return (
    <Center styles={{ flex: 0.7, backgroundColor: COLORS.white }}>
      <Flex mb={30}>
        <AutoHeightImage source={IMAGES.noNotification} width={125} />
      </Flex>
      <ScalableText style={styles.title} fontFamily="Bold">
        No Notification to show
      </ScalableText>
      <ScalableText style={styles.description} fontFamily="Medium">
        You currently have no notifications.We will notify when something new
        happens!
      </ScalableText>
    </Center>
  );
};

export default memo(EmptyNotifications);

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginVertical: 10,
    color: COLORS.primary,
    fontSize: 14,
  },
  description: {
    textAlign: "center",
    fontSize: 12,
    color: "#919191",
  },
});
