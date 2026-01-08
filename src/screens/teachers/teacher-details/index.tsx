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
import { useTeacherDetailsQuery } from "../../../apis/hooks/teachers/query/useTeacherDetails.query";
import Flex from "../../../@ui/flex/Flex";
import Tabs from "../../../@ui/tabs/Tabs";
import Center from "../../../@ui/center/Center";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import BatchDetailsTab from "./components/BatchDetailsTab";
import CourseDetailsTab from "./components/course-details-tab/CourseDetailsTab";
import { hasAnyPermissionSync } from "../../../utils/fetchPermissionsTitle";
import TimetableView from "./components/course-details-tab/Timetable/TimetableView";

const TeacherDetails = () => {
  const navigation = useNavigation<TScreenNavigator>();

  const {
    params: { teacherId },
  } = useRoute<RouteProp<TScreenNavigatorParams, "TeacherDetails">>();

  const { data, isLoading, refetch } = useTeacherDetailsQuery(teacherId);
  const [tab, setTab] = useState("Course Details");

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
    <SafeView>
      <AppHeader
        title="Teacher List"
        handleBackClick={() => navigation.goBack()}
        leftSection={
          <ActionIcon
            onPress={() =>
              navigation.navigate("TeacherProfileDetails", { teacherId })
            }
          >
            <AutoHeightImage source={IMAGES.profilePrimaryIcon} width={30} />
          </ActionIcon>
        }
        showDrawer={false}
      />

      <Flex my={20} mx={30}>
        <Tabs
          onChange={setTab}
          value={tab}
          tabs={[
            { value: "Course Details", label: "Course Details" },
            { label: "Batch Details", value: "Batch Details" },
            { label: "Time Table", value: "Time Table" },
          ]}
        />
      </Flex>

      <ThemeScrollView
        loading={isLoading}
        reloadData={refetch}
        paddingHorizontal={10}
      >
        {tab === "Batch Details" && (
          <BatchDetailsTab batches={teacherDetails?.batch ?? []} />
        )}
        {tab === "Course Details" && (
          <CourseDetailsTab courses={teacherDetails?.courses ?? []}/>
        )}
        {tab === "Time Table" && (
          <TimetableView teacherId={teacherId}/>
        )}
      </ThemeScrollView>
    </SafeView>
  );
};

export default TeacherDetails;
