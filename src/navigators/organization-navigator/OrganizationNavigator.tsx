// import React from "react";
// import {
//   NativeStackNavigationProp,
//   createNativeStackNavigator,
// } from "@react-navigation/native-stack";
// import SelectOrganization from "../../screens/organization/select-organization/SelectOrganization";
// import OrganizationLists from "../../screens/organization/organization-lists/OrganizationLists";
// const OrganizationNavigator = () => {
//   const Stack = createNativeStackNavigator<TOrganizationNavigatorParams>();

//   return (
//     <Stack.Navigator
//       initialRouteName="SelectOrganization"
//       screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}
//     >
//       <Stack.Screen name="SelectOrganization" component={SelectOrganization} />
//       <Stack.Screen name="OrganizationLists" component={OrganizationLists} />
//     </Stack.Navigator>
//   );
// };

// export default OrganizationNavigator;

// export type TOrganizationNavigator =
//   NativeStackNavigationProp<TOrganizationNavigatorParams>;



import React from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import SelectOrganization from "../../screens/organization/select-organization/SelectOrganization";
import OrganizationLists from "../../screens/organization/organization-lists/OrganizationLists";
import CreateOrganization from "../../screens/organization/select-organization/CreateOrganization"
const OrganizationNavigator = () => {
  const Stack = createNativeStackNavigator<TOrganizationNavigatorParams>();

  return (
    <Stack.Navigator
      initialRouteName="SelectOrganization"
      screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}
    >
      <Stack.Screen name="SelectOrganization" component={SelectOrganization} />
      <Stack.Screen name="OrganizationLists" component={OrganizationLists} />
      <Stack.Screen name="CreateOrganization" component={CreateOrganization} />

    </Stack.Navigator>
  );
};

export default OrganizationNavigator;

export type TOrganizationNavigator =
  NativeStackNavigationProp<TOrganizationNavigatorParams>;
