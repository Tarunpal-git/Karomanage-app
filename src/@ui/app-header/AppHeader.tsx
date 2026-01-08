import { StyleSheet } from "react-native";
import React, { FC } from "react";
import Flex from "../flex/Flex";
import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import {
  DrawerActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import ActionIcon from "../action-icon/ActionIcon";
import AppLogo from "../app-logo/AppLogo";
import ScalableText from "../scalable-text/ScalableText";
import { TDrawerNavigator } from "../../navigators/drawer-navigator/DrawerNavigator";
import { TScreenNavigatorParams } from "../../types/navigator/screen-navigator";
import { COLORS } from "../../colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IAppHeader {
  showDrawer?: boolean;
  title?: string;
  handleBackClick?: () => void;
  leftSection?: React.ReactNode;
  arrow?: "backArrowWhiteIcon" | "backArrowIcon";
}

const AppHeader: FC<IAppHeader> = ({
  showDrawer = true,
  title,
  handleBackClick,
  leftSection,
  arrow = "backArrowIcon",
}) => {
  const route = useRoute<RouteProp<TScreenNavigatorParams>>();
  const navigation = useNavigation<TDrawerNavigator>();
  const insets = useSafeAreaInsets();

  return (
    <Flex 
      justify="space-between" 
      styles={{
        ...styles.root,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }} 
      mb={15}
    >
      {!showDrawer && leftSection && leftSection}
      {showDrawer ? (
        <ActionIcon
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          styles={{ padding: 10 }}
        >
          <AutoHeightImage source={IMAGES.hamburgerIcon} width={19} />
        </ActionIcon>
      ) : (
        !leftSection && <Flex styles={{ paddingHorizontal: 20 }} />
      )}

      {route.name === "Home" ? (
        <AppLogo size="small" orient="horizontal" />
      ) : (
        <ScalableText
          style={{
            ...styles.screenName,
            color: arrow === "backArrowIcon" ? COLORS.black : COLORS.white,
          }}
          fontFamily="SemiBold"
        >
          {title}
        </ScalableText>
      )}
      {handleBackClick ? (
        <ActionIcon styles={{ padding: 10 }} onPress={handleBackClick}>
          <AutoHeightImage source={IMAGES[arrow]} width={26} />
        </ActionIcon>
      ) : (
        <Flex styles={{ padding: 10 }} />
      )}
    </Flex>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 15,
    flexWrap: "wrap",
  },
  screenName: {
    fontSize: 20,
  },
});
