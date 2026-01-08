import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";
import ActionIcon from "../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import SelectDropdown from "../../../@ui/select-dropdown/SelectDropdown";
import Flex from "../../../@ui/flex/Flex";
import { useStudentDetailsQuery } from "../../../apis/hooks/students/query/useStudentDetails.query";
import CollegeAndBatches from "./sections/college-and-batches/CollegeAndBatches";
import CourseDetails from "./sections/course-details/CourseDetails";
import FadeIn from "../../../@ui/animated-views/FadeIn";
import PaymentDetails from "./sections/payment-details/PaymentDetails";
import AttendanceHistory from "./sections/attendance-history/AttendanceHistory";
import AnnouncementHistory from "./sections/announcement-history/AnnouncementHistory";
import Media from "./sections/media";

const StudentDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const {
    params: { rollNo },
  } = useRoute<RouteProp<TScreenNavigatorParams, "StudentDetails">>();
  const { data, isLoading, refetch } = useStudentDetailsQuery(rollNo);

  const [section, setSection] = useState("College & Batch Details");

  const studentDetails: TStudentList = useMemo(() => {
    if (!isLoading && data?.data) {
      return data.data;
    } else {
      return undefined;
    }
  }, [isLoading, data]);

  const renderSection = useMemo(() => {
    switch (section) {
      case "College & Batch Details":
        return (
          <FadeIn delay={300}>
            <CollegeAndBatches details={studentDetails} />
          </FadeIn>
        );
      case "Course Details":
        return (
          <FadeIn delay={300}>
            <CourseDetails details={studentDetails} onCourseDeleted={refetch} />
          </FadeIn>
        );
      case "Payment Details":
        return (
          <FadeIn delay={300}>
            <PaymentDetails details={studentDetails} />
          </FadeIn>
        );
      case "Attendance History":
        return (
          <FadeIn delay={300}>
            <AttendanceHistory details={studentDetails} />
          </FadeIn>
        );
      case "Announcement History":
        return (
          <FadeIn delay={300}>
            <AnnouncementHistory announcements={studentDetails.announcements} />
          </FadeIn>
        );
      case "Media":
        return (
          <FadeIn delay={300}>
            <Media details={studentDetails} />
          </FadeIn>
        );

      default:
        return null;
    }
  }, [studentDetails, section]);

  return (
    <SafeView>
      <AppHeader
        title="Students Details"
        handleBackClick={() => navigation.goBack()}
        leftSection={
          <ActionIcon
            onPress={() =>
              navigation.navigate("StudentProfile", { rollNo: rollNo })
            }
          >
            <AutoHeightImage source={IMAGES.profilePrimaryIcon} width={30} />
          </ActionIcon>
        }
        showDrawer={false}
      />
      <ThemeScrollView
        paddingHorizontal={section === "Announcement History" ? 0 : 10}
        loading={isLoading}
        reloadData={refetch}
      >
        <Flex mt={10} mx={section === "Announcement History" ? 20 : 0}>
          <SelectDropdown
            label=""
            onChange={(e) => setSection(e)}
            options={[
              {
                label: "College & Batch Details",
                value: "College & Batch Details",
              },
              {
                label: "Course Details",
                value: "Course Details",
              },
              {
                label: "Payment Details",
                value: "Payment Details",
              },
              {
                label: "Attendance History",
                value: "Attendance History",
              },
              {
                label: "Announcement History",
                value: "Announcement History",
              },
              {
                label: "Documents",
                value: "Media",
              },
            ]}
            value={{
              label: "College & Batch Details",
              value: "College & Batch Details",
            }}
          />
        </Flex>

        {renderSection}
      </ThemeScrollView>
    </SafeView>
  );
};

export default StudentDetails;
