import React from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import SignUpScreen from "../../screens/auth/sign-up";
import MsalAuthWebView from "../../screens/auth/msal-auth-webview/MsalAuthWebView";

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator<TAuthNavigatorParams>();

  return (
    <Stack.Navigator
      initialRouteName="SignUpScreen"
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        initialParams={{ authenticated: false, id_token: "" }}
      />
      <Stack.Screen name="MsalAuthWebView" component={MsalAuthWebView} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

export type TAuthNavigator = NativeStackNavigationProp<TAuthNavigatorParams>;
