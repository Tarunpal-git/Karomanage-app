import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import SafeView from "../../@ui/safe-view/SafeView";
import AppHeader from "../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../@ui/theme-scroll-view/ThemeScrollView";
import ProfileOption from "./components/ProfileOption";
import Divider from "../../@ui/divider/Divider";
import Flex from "../../@ui/flex/Flex";
import AutoHeightImage from "../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import ScalableText from "../../@ui/scalable-text/ScalableText";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../app/reducer/auth/auth-reducer";
import { useNavigation } from "@react-navigation/native";
import { TProfileStackNavigator } from "../../navigators/tab-navigator/sub-stack-navigator/ProfileStackNavigator";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<TProfileStackNavigator>();
  return (
    <SafeView>
      <AppHeader title="Profile" showDrawer={false} />
      <ThemeScrollView>
        <ProfileOption
          icon="adminDetails"
          title="Admin Details"
          onPress={() => navigation.navigate("AdminDetails")}
        />
        <Divider my={10} />
        <ProfileOption
          icon="organizationDetails"
          title="Organization Details"
          onPress={() => navigation.navigate("OrganizationDetails")}
        />
        <Divider my={10} />

        <ProfileOption
          icon="switchOrganization"
          title="Switch Organization"
          onPress={() => navigation.navigate("SwitchOrganization")}
        />
        <Divider my={10} />
        <ProfileOption
          icon="Faq"
          title="FAQ"
          onPress={() => navigation.navigate("FAQ")}
        />
        <Divider my={10} />
        <ProfileOption
          icon="HelpSupport"
          title="Help & Support"
          onPress={() => navigation.navigate("HelpSupport")}
        />
        <Divider my={10} />

        <TouchableOpacity
          style={styles.root}
          onPress={() => {
            customAlert.show({
              message: "Are you sure you want to Logout? ",
              icon: "logoutPerson",
              okCallBack: () => dispatch(logout()),
              okTitle: "Yes",
              cancelTitle: "No",
            });
          }}
        >
          <Flex>
            <AutoHeightImage source={IMAGES["logOut"]} width={32} />
            <ScalableText fontFamily="Medium" style={styles.title}>
              Log Out
            </ScalableText>
          </Flex>
        </TouchableOpacity>
      </ThemeScrollView>
    </SafeView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  root: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    marginLeft: 23,
    color: "#D80005",
  },
});
