import React, { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../colors";
import ScalableText from "../../@ui/scalable-text/ScalableText";
import { TDrawerNavigator } from "./DrawerNavigator";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import AutoHeightImage from "../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import { TImages } from "../../images/images";

interface IDrawerMenu {
  heading: string;
  onClick: () => void;
  Icon: TImages;
  hasPermission: boolean;
}

const DrawerMenu = (props: IDrawerMenu) => {
  const { heading, onClick, Icon, hasPermission } = props;
  const navigation = useNavigation<TDrawerNavigator>();

  const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());
  
  // Don't render if no permission
  if (!hasPermission) {
    return null;
  }
  
  return (
    <TouchableOpacity
      style={styles.root}
      onPress={() => {
        toggleDrawer();
        onClick();
      }}
    >
      <AutoHeightImage source={IMAGES[Icon]} width={24} />
      <ScalableText fontFamily="Medium" style={styles.menuName}>
        {heading}
      </ScalableText>
    </TouchableOpacity>
  );
};

export default memo(DrawerMenu);

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },
  menuName: {
    color: "#6F6F6F",
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 15,
  },
});
