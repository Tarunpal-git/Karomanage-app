import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ActionIcon from "../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import { COLORS } from "../../../colors";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useEmployeeDetailsQuery } from "../../../apis/hooks/employee/query/useEmployeeDetails.query";
import Center from "../../../@ui/center/Center";
import moment from "moment";
import Avatar from "../../../@ui/avatar/Avatar";
import { isEmptyString } from "../../../utils/isEmptyString";
import Button from "../../../@ui/button/Button";

const EmployeeDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const {
    params: { employeeId },
  } = useRoute<RouteProp<TScreenNavigatorParams, "EmployeeDetails">>();
  const { data, isLoading, refetch } = useEmployeeDetailsQuery(employeeId);
  const employeeDetails: TEmployeeData = useMemo(() => {
    if (!isLoading && data?.data) {
      return data.data;
    } else {
      return undefined;
    }
  }, [isLoading, data]);

  if (isLoading && !employeeDetails) {
    return <Center loading />;
  }

  return (
    <SafeView bg={COLORS.primary}>
      <AppHeader
        title="Employee Details"
        handleBackClick={() => navigation.goBack()}
        leftSection={
          <ActionIcon>
            <AutoHeightImage source={IMAGES.profileWhiteIcon} width={30} />
          </ActionIcon>
        }
        showDrawer={false}
        arrow="backArrowWhiteIcon"
      />

      <View style={styles.screenRoot}>
        <Flex flexDirection="column" styles={styles.profileAvatar}>
          <Avatar
            size={77}
            textStyle={{ fontSize: 35 }}
            content={`${employeeDetails?.employeePersonalDetails?.employeeFirstname} ${employeeDetails?.employeePersonalDetails?.employeeLastname}`}
          />
          <ScalableText style={styles.userNameText} fontFamily="SemiBold">
            {employeeDetails?.employeePersonalDetails?.employeeFirstname ?? "-"}{" "}
            {employeeDetails?.employeePersonalDetails?.employeeLastname ?? ""}
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
                      Department
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
                    {isEmptyString(
                      employeeDetails?.employeePersonalDetails
                        .employeeDepartment
                    )}
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
                      Designation
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
                    {isEmptyString(
                      employeeDetails?.employeePersonalDetails
                        ?.employeeDesignation
                    )}
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
                    {isEmptyString(
                      employeeDetails?.employeePersonalDetails?.employeeEmail
                    )}
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
                      Date of birth
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
                    {employeeDetails?.employeePersonalDetails
                      ?.employeeDateOfBirth
                      ? isEmptyString(
                          moment(
                            employeeDetails?.employeePersonalDetails
                              ?.employeeDateOfBirth,
                            "DD/MM/YYYY"
                          ).format("DD-MM-YY")
                        )
                      : "-"}
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
                      Skills
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
                    {isEmptyString(
                      employeeDetails?.employeeProfessionalDetails
                        ?.employeeSkills
                    )}
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
                    {isEmptyString(
                      employeeDetails?.employeePersonalDetails
                        ?.employeePhoneNumber
                    )}
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
                      Experience
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
                    {isEmptyString(
                      employeeDetails?.employeeProfessionalDetails
                        ?.releventExperienceYear
                    )}
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
                      Joining date
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
                    {employeeDetails?.employeeProfessionalDetails?.dateOfJoining
                      ? moment(
                          employeeDetails?.employeeProfessionalDetails
                            ?.dateOfJoining,
                          "DD/MM/YYYY"
                        ).format("DD-MM-YY")
                      : "-"}
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
                        employeeDetails?.employeeStatus === "active"
                          ? COLORS.textSuccess
                          : COLORS.textError,
                    }}
                    fontFamily="Medium"
                  >
                    {isEmptyString(employeeDetails?.employeeStatus)}
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

export default EmployeeDetails;

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

    zIndex: 5,
    top: -25,
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
