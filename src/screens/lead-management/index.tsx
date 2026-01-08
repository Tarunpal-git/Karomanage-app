import React from "react";
import SafeView from "../../@ui/safe-view/SafeView";
import AppHeader from "../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../types/navigator/screen-navigator";
import Flex from "../../@ui/flex/Flex";
import AutoHeightImage from "../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import ThemeScrollView from "../../@ui/theme-scroll-view/ThemeScrollView";
import ScalableText from "../../@ui/scalable-text/ScalableText";

const LeadManagement = () => {
  const navigation = useNavigation<TScreenNavigator>();
  return (
    <SafeView>
      <AppHeader
        title="Lead Management"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />

      <ThemeScrollView>
        <Flex styles={{ flexWrap: "wrap" }} mt={40} justify="space-between">
          <Flex
            my={20}
            flexDirection="column"
            onClick={() => navigation.navigate("LeadManagementForms")}
          >
            <AutoHeightImage source={IMAGES.formsImage} width={130} />
            <ScalableText
              style={{ fontSize: 16, marginTop: 15 }}
              fontFamily="Regular"
            >
              Forms
            </ScalableText>
          </Flex>
          <Flex
            my={20}
            flexDirection="column"
            onClick={() => navigation.navigate("UploadFormList")}
          >
            <AutoHeightImage source={IMAGES.uploadImage} width={130} />
            <ScalableText
              style={{ fontSize: 16, marginTop: 15 }}
              fontFamily="Regular"
            >
              Upload Data
            </ScalableText>
          </Flex>

          {/* Alignment is done and also I've removed the manager feature for now because its UI is not available yet */}
          {/* <Flex my={20} flexDirection="column">
            <AutoHeightImage source={IMAGES.mangerImage} width={130} />
            <ScalableText
              style={{ fontSize: 16, marginTop: 15 }}
              fontFamily="Regular"
            >
              Manager
            </ScalableText>
          </Flex> */}

        </Flex>
      </ThemeScrollView>
    </SafeView>
  );
};

export default LeadManagement;