import { Linking, StyleSheet } from "react-native";
import React from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import Center from "../../../@ui/center/Center";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import { SCREEN_WIDTH } from "../../../constants/Screen";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";

const EmptyOrganization = () => {
  return (
    <SafeView>
      <ThemeScrollView>
        <Center>
          <AutoHeightImage
            source={IMAGES.noOrganization}
            width={SCREEN_WIDTH - 30}
          />
          <ScalableText style={styles.description} fontFamily="Regular">
            Please create organization on Karomanage portal:{" "}
            <ScalableText
              onPress={() => Linking.openURL("https://portal.karomanage.com/")}
              fontFamily="Regular"
              style={{ color: COLORS.primary, textDecorationLine: "underline" }}
            >
              Karomanage
            </ScalableText>
          </ScalableText>
        </Center>
      </ThemeScrollView>
    </SafeView>
  );
};

export default EmptyOrganization;

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: "center",
    lineHeight: 24,
  },
});
