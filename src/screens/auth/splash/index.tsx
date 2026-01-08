import { StyleSheet } from "react-native";
import React from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import Center from "../../../@ui/center/Center";
import AppLogo from "../../../@ui/app-logo/AppLogo";
import FadeIn from "../../../@ui/animated-views/FadeIn";

const SplashScreen = () => {
  return (
    <SafeView>
      <Center>
        <FadeIn delay={300}>
          <AppLogo size="default" />
        </FadeIn>
      </Center>
    </SafeView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
