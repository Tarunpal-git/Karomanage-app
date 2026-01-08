import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";

import Flex from "../../../@ui/flex/Flex";
import Avatar from "../../../@ui/avatar/Avatar";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import { getStatusColor } from "../../../utils/getStatusColor";
import { useCourseDetailsQuery } from "../../../apis/hooks/course/query/useCourseDetails.query";
import CoursesPaymentOverviewDetails from "../course-lists/utils/CoursesPaymentOverviewDetails";
import { isEmptyString } from "../../../utils/isEmptyString";
import UpdateCourse from "../update-course";
import { hasUpdatePermission } from "../../../utils/fetchPermissionsTitle";

const CourseDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { courseId, autoOpenEdit } =
    useRoute<RouteProp<TScreenNavigatorParams, "CourseDetails">>().params;
  const { isLoading, data, refetch } = useCourseDetailsQuery({ courseId });
  const [showUpdateForm, setShowUpdateForm] = useState(autoOpenEdit || false);

  const courseDetails: TCourseData = useMemo(() => {
    if (!isLoading && data && data.statusCode === 200) {
      return data.data;
    } else {
      return undefined;
    }
  }, [isLoading, data]);

  const courseStudents = useMemo(() => {
    if (!isLoading && courseDetails) {
      return courseDetails?.batch?.flatMap((batch) =>
        batch.students.map((student) => student)
      );
    } else {
      return [];
    }
  }, [isLoading, courseDetails]);

  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        title="Course Details"
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView
        loading={isLoading}
        reloadData={refetch}
        paddingHorizontal={15}
      >
        <Flex
          styles={styles.courseDetailsCard}
          flexDirection="column"
          align="flex-start"
        >
          <Flex mb={30} align="center">
            <Flex>
              <Avatar
                size={39}
                content={courseDetails?.courseName}
                backgroundColor="#E3F2FF"
                textStyle={{
                  color: COLORS.primary,
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 20,
                }}
              />
              <Flex flex={1}>
                <ScalableText style={styles.title} fontFamily="Bold">
                  {courseDetails?.courseName}
                </ScalableText>
              </Flex>
            </Flex>
            {hasUpdatePermission("Courses") && (
              <TouchableOpacity
                onPress={() => {
                  console.log('Opening update course form');
                  setShowUpdateForm(true);
                }}
                style={{ padding: 8, marginLeft: -30 }}
              >
                <AutoHeightImage source={IMAGES.editIcon} width={20} />
              </TouchableOpacity>
            )}
          </Flex>

          <Flex flexDirection="column" ml={5} align="flex-start">
            {/* <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Course ID:{" "}
              <ScalableText style={styles.detailsContent} fontFamily="Medium">
                {courseId}{" "}
              </ScalableText>
            </ScalableText> */}
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Course Name:{" "}
              <ScalableText style={styles.detailsContent} fontFamily="Medium">
                {isEmptyString(courseDetails?.courseName)}{" "}
              </ScalableText>
            </ScalableText>
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Course Fee:{" "}
              <ScalableText style={styles.detailsContent} fontFamily="Medium">
                {courseDetails?.courseFee.toLocaleString()}
              </ScalableText>
            </ScalableText>
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Fee Description:{" "}
              <ScalableText style={styles.detailsContent} fontFamily="Medium">
                {isEmptyString(courseDetails?.courseFeeDescription)}
              </ScalableText>
            </ScalableText>
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Course Description:{" "}
              <ScalableText style={styles.detailsContent} fontFamily="Medium">
                {isEmptyString(courseDetails?.courseDescription)}{" "}
              </ScalableText>
            </ScalableText>
            <ScalableText fontFamily="SemiBold" style={styles.detailsHeading}>
              Status:{" "}
              <ScalableText
                style={{
                  ...styles.detailsContent,
                  color: getStatusColor(courseDetails?.courseStatus),
                }}
                fontFamily="Medium"
              >
                {courseDetails?.courseStatus}{" "}
              </ScalableText>
            </ScalableText>
          </Flex>
        </Flex>
        {courseStudents && (
          <CoursesPaymentOverviewDetails
            students={courseStudents}
            courseId={courseId}
          />
        )}
      </ThemeScrollView>
      
      {showUpdateForm && (
        <View style={styles.modalOverlay}>
          <UpdateCourse
            courseData={courseDetails}
            onClose={() => {
              console.log('Closing update course form');
              setShowUpdateForm(false);
              refetch();
            }}
          />
        </View>
      )}
    </SafeView>
  );
};

export default CourseDetails;

const styles = StyleSheet.create({
  courseDetailsCard: {
    backgroundColor: COLORS.white,
    elevation: 4,
    padding: 15,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
  },
  title: {
    fontSize: 20,
    color: COLORS.primary,
    textTransform: "capitalize",
    marginLeft: 10,
  },
  detailsHeading: {
    fontSize: 16,
    marginVertical: 15,
  },
  detailsContent: {
    color: "#646464",
    fontSize: 14,
    textTransform: "capitalize",
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});
