import { StyleSheet } from "react-native";
import React from "react";
import SafeView from "../../@ui/safe-view/SafeView";
import AppHeader from "../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TProfileStackNavigator } from "../../navigators/tab-navigator/sub-stack-navigator/ProfileStackNavigator";
import ThemeScrollView from "../../@ui/theme-scroll-view/ThemeScrollView";
import Card from "../../@ui/card/Card";
import Flex from "../../@ui/flex/Flex";
import AutoHeightImage from "../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import ScalableText from "../../@ui/scalable-text/ScalableText";
import { useAppSelector } from "../../app/hooks";
import { COLORS } from "../../colors";
import { isEmptyString } from "../../utils/isEmptyString";

const AdminDetails = () => {
  const navigation = useNavigation<TProfileStackNavigator>();
  const admin = useAppSelector((state) => state.auth.authUser);
  const organization = useAppSelector(
    (state) => state.organization.organization
  );
  return (
    <SafeView>
      <AppHeader
        title="Admin Details"
        showDrawer={false}
        handleBackClick={() => navigation.navigate("Profile")}
      />
      <ThemeScrollView paddingHorizontal={15}>
        <Card styles={styles.detailsCard} align="flex-start">
          <Flex flexDirection="column" align="center" w={"100%"} mb={30}>
            <AutoHeightImage source={IMAGES.adminLogo} width={61} />
            <Flex
              my={10}
              styles={{ ...styles.statusChipError, backgroundColor: "#FFE3E3" }}
            >
              <ScalableText
                style={{ ...styles.statusChipErrorText, color: "#FF6363" }}
                fontFamily="Medium"
              >
                {admin?.userType}
              </ScalableText>
            </Flex>
          </Flex>

          <Flex my={15} align="flex-start">
            <Flex>
              <ScalableText style={styles.heading} fontFamily="SemiBold">
                Name:
              </ScalableText>
            </Flex>
            <Flex flex={1}>
              <ScalableText style={styles.content} fontFamily="Medium">
                {admin?.customerName} {admin?.lastName}
              </ScalableText>
            </Flex>
          </Flex>
          <Flex my={15} align="flex-start">
            <Flex>
              <ScalableText style={styles.heading} fontFamily="SemiBold">
                Email:
              </ScalableText>
            </Flex>
            <Flex flex={1}>
              <ScalableText style={styles.content} fontFamily="Medium">
                {isEmptyString(admin?.customerEmail)}
              </ScalableText>
            </Flex>
          </Flex>
          <Flex my={15} align="flex-start">
            <Flex>
              <ScalableText style={styles.heading} fontFamily="SemiBold">
                City:
              </ScalableText>
            </Flex>
            <Flex flex={1}>
              <ScalableText style={styles.content} fontFamily="Medium">
                {isEmptyString(organization.organizationCity)}
              </ScalableText>
            </Flex>
          </Flex>
          <Flex my={15} align="flex-start">
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              Status:
            </ScalableText>
            <Flex
              styles={{
                ...styles.statusChipError,
                backgroundColor: "#D4FFC5",
              }}
            >
              <ScalableText
                style={{ ...styles.statusChipErrorText, color: "#3BE500" }}
                fontFamily="Medium"
              >
                Active
              </ScalableText>
            </Flex>
          </Flex>
        </Card>
      </ThemeScrollView>
    </SafeView>
  );
};

export default AdminDetails;

const styles = StyleSheet.create({
  detailsCard: {
    elevation: 3,
    paddingHorizontal: 25,
    paddingVertical: 35,
    borderRadius: 6,
  },
  statusChipError: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  statusChipErrorText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  heading: { fontSize: 14, width: 80, color: COLORS.primary },
  content: {
    fontSize: 14,
    color: "#757575",
  },
});
