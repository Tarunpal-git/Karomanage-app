import React from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Profile from "../../../screens/profile";
import AdminDetails from "../../../screens/admin-details";
import OrganizationDetails from "../../../screens/organization-details";
import SwitchOrganization from "../../../screens/switch-organization";
import HelpSupportScreen from "../../../screens/HelpSupport";
import FAQ from "../../../screens/FAQ";

const ProfileStackNavigator = () => {
  const Stack = createNativeStackNavigator<TProfileStackNavigatorParams>();
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AdminDetails" component={AdminDetails} />
      <Stack.Screen
        name="OrganizationDetails"
        component={OrganizationDetails}
      />
      <Stack.Screen name="SwitchOrganization" component={SwitchOrganization} />
      <Stack.Screen name="FAQ" component={FAQ} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;

export type TProfileStackNavigator =
  NativeStackNavigationProp<TProfileStackNavigatorParams>;
