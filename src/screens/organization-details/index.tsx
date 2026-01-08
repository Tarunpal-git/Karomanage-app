import { StyleSheet } from "react-native";
import React from "react";
import SafeView from "../../@ui/safe-view/SafeView";
import AppHeader from "../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TProfileStackNavigator } from "../../navigators/tab-navigator/sub-stack-navigator/ProfileStackNavigator";
import ThemeScrollView from "../../@ui/theme-scroll-view/ThemeScrollView";
import Card from "../../@ui/card/Card";
import Flex from "../../@ui/flex/Flex";
import ScalableText from "../../@ui/scalable-text/ScalableText";
import { useAppSelector } from "../../app/hooks";
import { COLORS } from "../../colors";
import { isEmptyString } from "../../utils/isEmptyString";

const OrganizationDetails = () => {
const navigation = useNavigation<TProfileStackNavigator>();

  const organization = useAppSelector(
    (state) => state.organization.organization
  );

  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        handleBackClick={() => navigation.navigate("Profile")}
        title="Organization Details"
      />
      <ThemeScrollView paddingHorizontal={15}>
        <Card styles={styles.detailsCard} align="flex-start">
          <Flex my={15} align="flex-start">
            <Flex>
              <ScalableText style={styles.heading} fontFamily="SemiBold">
                Name:
              </ScalableText>
            </Flex>

            <Flex flex={1}>
              <ScalableText style={styles.content} fontFamily="Medium">
                {isEmptyString(organization.organizationName)}
              </ScalableText>
            </Flex>
          </Flex>
          <Flex my={15} align="flex-start">
            <Flex>
              <ScalableText style={styles.heading} fontFamily="SemiBold">
                Phone Number:
              </ScalableText>
            </Flex>

            <Flex flex={1}>
              <ScalableText style={styles.content} fontFamily="Medium">
                {isEmptyString(organization.organizationPhoneNumber)}
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
                {isEmptyString(organization.organizationEmail)}
              </ScalableText>
            </Flex>
          </Flex>
          <Flex my={15} align="flex-start">
            <Flex>
              <ScalableText style={styles.heading} fontFamily="SemiBold">
                Address:
              </ScalableText>
            </Flex>
            <Flex flex={1}>
              <ScalableText style={styles.content} fontFamily="Medium">
                {isEmptyString(organization.organizationAddress)}
              </ScalableText>
            </Flex>
          </Flex>
          <Flex my={15} align="flex-start">
            <Flex>
              <ScalableText style={styles.heading} fontFamily="SemiBold">
                Description:
              </ScalableText>
            </Flex>
            <Flex flex={1}>
              <ScalableText style={styles.content} fontFamily="Medium">
                {isEmptyString(organization.organizationDetails)}
              </ScalableText>
            </Flex>
          </Flex>
        </Card>
      </ThemeScrollView>
    </SafeView>
  );
};

export default OrganizationDetails;

const styles = StyleSheet.create({
    detailsCard: {
    elevation: 0,
    paddingHorizontal: 25,
    paddingVertical: 35,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
  },

    heading: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 10,
  },
    content: {
    fontSize: 14,
    color: "#757575",
  },
});