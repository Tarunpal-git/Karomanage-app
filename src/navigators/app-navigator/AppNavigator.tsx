import React, { useEffect } from "react";
import AuthNavigator from "../auth-navigator/AuthNavigator";
import { checkAuthentication } from "../../services/checkAuthentication";
import { useAppSelector } from "../../app/hooks";
import SplashScreen from "../../screens/auth/splash";
import OrganizationNavigator from "../organization-navigator/OrganizationNavigator";
import DrawerNavigator from "../drawer-navigator/DrawerNavigator";

const AppNavigator = () => {
  const navigationRoute = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuthentication();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  switch (navigationRoute) {
    case "authenticating":
      return <SplashScreen />;
    case "loggedIn":
      return <OrganizationNavigator />;
    case "organization":
      return <DrawerNavigator />;
    default:
      return <AuthNavigator />;
  }
};

export default AppNavigator;
