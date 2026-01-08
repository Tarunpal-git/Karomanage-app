import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SideDrawer from "./SideDrawer";
import { COLORS } from "../../colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TabNavigator from "../tab-navigator/TabNavigator";
import { useOrganizationDetailsQuery } from "../../apis/hooks/organization/query/useOrganizationDetails.query";
import Center from "../../@ui/center/Center";
import { BottomSheetProvider } from "../../context/bottom-sheet/BottomSheetContext";

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator<TDrawerNavigatorParams>();
  const { isLoading } = useOrganizationDetailsQuery();

  if (isLoading) {
    return (
      <Center>
        <ActivityIndicator color={COLORS.primary} size={25} />
      </Center>
    );
  }
  return (
    <BottomSheetProvider>
      <Drawer.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          drawerStatusBarAnimation: "slide",
          headerShown: false,
          drawerStyle: styles.drawerStyle,
        }}
        drawerContent={SideDrawer}
      >
        <Drawer.Screen name="Tabs" component={TabNavigator} />
      </Drawer.Navigator>
    </BottomSheetProvider>
  );
};

export default DrawerNavigator;

export type TDrawerNavigator =
  NativeStackNavigationProp<TDrawerNavigatorParams>;

const styles = StyleSheet.create({
  drawerStyle: {
    backgroundColor: COLORS.white,
    width: 309,
    // Shadow properties for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 4,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    elevation: 2,
  },
});
