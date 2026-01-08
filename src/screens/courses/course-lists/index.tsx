import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../../@ui/flex/Flex";
import SearchBar from "../../../@ui/search-bar/SearchBar";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import { filteredCourseLists } from "./utils/filteredCourseLists";
import { useCourseListsQuery } from "../../../apis/hooks/course/query/useCourseLists.query";
import Button from "../../../@ui/button/Button";
import { hasCreatePermission } from "../../../utils/fetchPermissionsTitle";

const CourseLists = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const { data, isLoading, refetch } = useCourseListsQuery();

  const [filter, setFilter] = useState({ search: "" });

  const coursesLists: TCourseData[] = useMemo(() => {
    if (!isLoading && data.statusCode === 200) {
      return filteredCourseLists(data.data, filter);
    } else {
      return [];
    }
  }, [isLoading, data, filter]);

  return (
    <SafeView>
      <AppHeader
        showDrawer={false}
        title="Course List"
        handleBackClick={() => navigation.goBack()}
      />

      <ThemeScrollView
        paddingHorizontal={15}
        loading={isLoading}
        reloadData={refetch}
        >
        <Flex mt={1} mb={20}>
          <SearchBar
            onChange={(text) =>
              setFilter((state) => ({ ...state, search: text }))
            }
            value={filter.search}
          />
        </Flex>
        {hasCreatePermission("Courses") && (
          <Flex mb={2} mt={2} flexDirection="row" justify="flex-end">
            <Button
              title="Add Course"
              onPress={() => navigation.navigate("CreateCourse")}
              btnStyles={{ width: 110, height: 34, borderRadius: 8 }}
              btnTxtStyles={{ fontSize: 13, fontFamily: 'Poppins-Medium' }}
            />
          </Flex>
        )}

        {/* <Flex justify="center" my={30}>
          <ScalableText style={styles.title} fontFamily="Bold">
            Course Name
          </ScalableText>
        </Flex> */}

        {coursesLists.map((course) => (
          <TouchableOpacity
            style={styles.batchRow}
            key={course.courseId}
            onPress={() =>
              navigation.navigate("CourseDetails", {
                courseId: course.courseId,
              })
            }
          >
            <ScalableText
              numberOfLines={2}
              style={styles.batchName}
              fontFamily="Medium"
            >
              {course.courseName}
            </ScalableText>
            <AutoHeightImage source={IMAGES.chevronRightBlack} width={14} />
          </TouchableOpacity>
        ))}
      </ThemeScrollView>
    </SafeView>
  );
};

export default CourseLists;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: COLORS.primary,
  },
  batchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    elevation: 4,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 14,
  },
  batchName: {
    fontSize: 16,
    textTransform: "capitalize",
  },
});
