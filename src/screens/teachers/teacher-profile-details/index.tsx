import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../../colors";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { Col, Grid, Row } from "react-native-easy-grid";
import Center from "../../../@ui/center/Center";

import { useTeacherDetailsQuery } from "../../../apis/hooks/teachers/query/useTeacherDetails.query";
import Avatar from "../../../@ui/avatar/Avatar";

const TeacherProfileDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const {
    params: { teacherId },
  } = useRoute<RouteProp<TScreenNavigatorParams, "TeacherProfileDetails">>();

  const { data, isLoading, refetch } = useTeacherDetailsQuery(teacherId);

  const teacherDetails: TTeacherData = useMemo(() => {
    if (!isLoading && data?.data) {
      return data.data;
    } else {
      return undefined;
    }
  }, [isLoading, data]);

  if (isLoading && !teacherDetails) {
    return <Center loading />;
  }

  return (
    <SafeView bg={COLORS.primary}>
      <AppHeader
        title="Teacher Details"
        handleBackClick={() => navigation.goBack()}
        showDrawer={false}
        arrow="backArrowWhiteIcon"
      />

      <View style={styles.screenRoot}>
        <Flex flexDirection="column" styles={styles.profileAvatar}>
          <Avatar
            size={77}
            textStyle={{ fontSize: 35 }}
            content={`${teacherDetails?.teacherFirstName} ${teacherDetails?.teacherLastName}`}
          />
          <ScalableText style={styles.userNameText} fontFamily="SemiBold">
            {teacherDetails?.teacherFirstName ?? " "}{" "}
            {teacherDetails?.teacherLastName ?? ""}
          </ScalableText>
        </Flex>

        <ThemeScrollView
          loading={isLoading}
          reloadData={refetch}
          style={{ borderTopLeftRadius: 46, borderTopRightRadius: 46 }}
        >
          <Flex mt={140}>
            <Grid>
              <Row style={styles.sectionContentRow}>
                <Col size={0.6}>
                  <Flex justify="space-between">
                    <ScalableText
                      style={styles.sectionContentTitle}
                      fontFamily="Bold"
                    >
                      Full Name
                    </ScalableText>
                    <ScalableText
                      style={styles.sectionContentTitle}
                      fontFamily="Bold"
                    >
                      :
                    </ScalableText>
                  </Flex>
                </Col>
                <Col>
                  <ScalableText
                    style={styles.sectionContentDataText}
                    fontFamily="Medium"
                  >
                    {`${teacherDetails?.teacherFirstName} ${
                      teacherDetails?.teacherLastName ?? ""
                    }`}
                  </ScalableText>
                </Col>
              </Row>
              <Row style={styles.sectionContentRow}>
                <Col size={0.6}>
                  <Flex justify="space-between">
                    <ScalableText
                      style={styles.sectionContentTitle}
                      fontFamily="Bold"
                    >
                      Email
                    </ScalableText>
                    <ScalableText
                      style={styles.sectionContentTitle}
                      fontFamily="Bold"
                    >
                      :
                    </ScalableText>
                  </Flex>
                </Col>
                <Col>
                  <ScalableText
                    style={styles.sectionContentDataText}
                    fontFamily="Medium"
                  >
                    {teacherDetails?.teacherEmail ?? "-"}
                  </ScalableText>
                </Col>
              </Row>
              <Row style={styles.sectionContentRow}>
                <Col size={0.6}>
                  <Flex justify="space-between">
                    <ScalableText
                      style={styles.sectionContentTitle}
                      fontFamily="Bold"
                    >
                      Contact
                    </ScalableText>
                    <ScalableText
                      style={styles.sectionContentTitle}
                      fontFamily="Bold"
                    >
                      :
                    </ScalableText>
                  </Flex>
                </Col>
                <Col>
                  <ScalableText
                    style={styles.sectionContentDataText}
                    fontFamily="Medium"
                  >
                    {teacherDetails?.teacherPhoneNumber ?? "-"}
                  </ScalableText>
                </Col>
              </Row>

              <Row style={styles.sectionContentRow}>
                <Col size={0.6}>
                  <Flex justify="space-between">
                    <ScalableText
                      style={styles.sectionContentTitle}
                      fontFamily="Bold"
                    >
                      Status
                    </ScalableText>
                    <ScalableText
                      style={styles.sectionContentTitle}
                      fontFamily="Bold"
                    >
                      :
                    </ScalableText>
                  </Flex>
                </Col>
                <Col>
                  <ScalableText
                    style={{
                      ...styles.sectionContentDataText,
                      textTransform: "capitalize",
                      color:
                        teacherDetails?.teacherStatus === "active"
                          ? COLORS.textSuccess
                          : COLORS.textError,
                    }}
                    fontFamily="Medium"
                  >
                    {teacherDetails?.teacherStatus ?? ""}
                  </ScalableText>
                </Col>
              </Row>
            </Grid>
          </Flex>
        </ThemeScrollView>
      </View>
    </SafeView>
  );
};

export default TeacherProfileDetails;

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    marginTop: 50,
    position: "relative",
    zIndex: 5,
  },
  userNameText: {
    fontSize: 18,
    color: "#1B1A1A",
    marginTop: 20,
  },
  profileAvatar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -25,
    zIndex: 5,
  },
  sectionContentRow: {
    marginVertical: 10,
  },
  sectionContentTitle: {
    fontSize: 14,
    color: COLORS.primary,
  },
  sectionContentDataText: {
    textAlign: "left",
    marginLeft: 22,
    color: "#6F6F6F",
    fontSize: 14,
  },
});
