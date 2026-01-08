import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";
import { useEnquiryDetailsQuery } from "../../../apis/hooks/enquiry/query/useEnquiryDetails.query";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import Flex from "../../../@ui/flex/Flex";
import ActionIcon from "../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import { useUpdateStudentEnquiryMutation } from "../../../apis/hooks/enquiry/mutation/useUpdateStudentEnquiry.mutation";

const ViewEnquiry = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { id } =
    useRoute<RouteProp<TScreenNavigatorParams, "EnquiryDetails">>().params;

  const { data, isLoading, refetch } = useEnquiryDetailsQuery(id);
  const { mutateAsync: removeEnquiry, isPending } =
    useUpdateStudentEnquiryMutation();

  const enquiryDetails: TEnquiryData = useMemo(() => {
    if (!isLoading && data?.dataArray) {
      return data.dataArray;
    } else {
      return undefined;
    }
  }, [isLoading, data]);

  const handleDeleteEnquiry = async () => {
    const res = await removeEnquiry({
      details: { ...enquiryDetails, status: "delete" },
    });

    if (res.statusCode === 200) {
      navigation.navigate("EnquiryLists");
    } else {
      customAlert.show({
        message: "Enquiry not generated. Try again later",
      });
    }
  };

  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        title="Generate Enquiry"
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView
        loading={isLoading}
        reloadData={refetch}
        paddingHorizontal={12}
      >
        <View style={styles.formRoot}>
          <Flex justify="space-between" mb={15}>
            <ScalableText style={styles.formTitle} fontFamily="Bold">
              Personal Details
            </ScalableText>
            <Flex>
              <ActionIcon
                onPress={() =>
                  navigation.navigate("EditEnquiryDetails", { id })
                }
                mx={5}
              >
                <AutoHeightImage width={24} source={IMAGES.editActiveIcon} />
              </ActionIcon>
              <ActionIcon
                onPress={() =>
                  customAlert.show({
                    message: "Are you sure you want to delete this enquiry.",
                    cancelTitle: "NO",
                    okTitle: "Yes",
                    loading: isPending,
                    okCallBack: handleDeleteEnquiry,
                  })
                }
                ml={5}
              >
                <AutoHeightImage width={24} source={IMAGES.deleteActiveIcon} />
              </ActionIcon>
            </Flex>
          </Flex>
          <Flex styles={{ flexWrap: "wrap" }} mb={15}>
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              Student:
            </ScalableText>
            <ScalableText style={styles.description} fontFamily="Medium">
              {enquiryDetails.studentName}
            </ScalableText>
          </Flex>
          <Flex styles={{ flexWrap: "wrap" }} mb={15}>
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              Email:
            </ScalableText>
            <ScalableText style={styles.description} fontFamily="Medium">
              {enquiryDetails.email}
            </ScalableText>
          </Flex>

          <Flex styles={{ flexWrap: "wrap" }} mb={15}>
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              Enquiry Course:
            </ScalableText>
            <ScalableText style={styles.description} fontFamily="Medium">
              {enquiryDetails.enquiryCourse}
            </ScalableText>
          </Flex>
          <Flex styles={{ flexWrap: "wrap" }} mb={15}>
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              Contact :
            </ScalableText>
            <ScalableText style={styles.description} fontFamily="Medium">
              {enquiryDetails.mobileNumber}
            </ScalableText>
          </Flex>
          <Flex styles={{ flexWrap: "wrap" }} mb={15}>
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              Status:
            </ScalableText>
            <ScalableText
              style={{
                ...styles.description,
                color:
                  enquiryDetails.status === "active"
                    ? COLORS.success
                    : COLORS.error,
                textTransform: "capitalize",
              }}
              fontFamily="Medium"
            >
              {enquiryDetails.status}
            </ScalableText>
          </Flex>
        </View>
        <View style={styles.formRoot}>
          <Flex justify="space-between" mb={15}>
            <ScalableText style={styles.formTitle} fontFamily="Bold">
              College Details
            </ScalableText>
            <Flex>
              <ActionIcon
                onPress={() =>
                  navigation.navigate("EditEnquiryDetails", { id })
                }
                mx={5}
              >
                <AutoHeightImage width={24} source={IMAGES.editActiveIcon} />
              </ActionIcon>
              <ActionIcon
                ml={5}
                onPress={() =>
                  customAlert.show({
                    message: "Are you sure you want to delete this enquiry.",
                    cancelTitle: "NO",
                    okTitle: "Yes",
                  })
                }
              >
                <AutoHeightImage width={24} source={IMAGES.deleteActiveIcon} />
              </ActionIcon>
            </Flex>
          </Flex>
          <Flex styles={{ flexWrap: "wrap" }} mb={15}>
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              College:
            </ScalableText>
            <ScalableText style={styles.description} fontFamily="Medium">
              {enquiryDetails.college}
            </ScalableText>
          </Flex>
          <Flex styles={{ flexWrap: "wrap" }} mb={15}>
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              Semester:
            </ScalableText>
            <ScalableText style={styles.description} fontFamily="Medium">
              {enquiryDetails.semester}
            </ScalableText>
          </Flex>
          <Flex styles={{ flexWrap: "wrap" }} mb={15}>
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              College Department:
            </ScalableText>
            <ScalableText style={styles.description} fontFamily="Medium">
              {enquiryDetails.collegeDepartment}
            </ScalableText>
          </Flex>
          <Flex styles={{ flexWrap: "wrap" }} mb={15}>
            <ScalableText style={styles.heading} fontFamily="SemiBold">
              College Courses:
            </ScalableText>
            <ScalableText style={styles.description} fontFamily="Medium">
              {enquiryDetails.courseDescription}
            </ScalableText>
          </Flex>
        </View>
      </ThemeScrollView>
    </SafeView>
  );
};

export default ViewEnquiry;

const styles = StyleSheet.create({
  formRoot: {
    padding: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 7,
    marginVertical: 6,
    elevation: 2,
    backgroundColor: COLORS.white,
    flexDirection: "column",
  },
  formTitle: {
    fontSize: 16,
    color: COLORS.primary,
  },
  heading: { fontSize: 14, marginRight: 10 },
  description: {
    color: "#646464",
    fontSize: 14,
  },
});
