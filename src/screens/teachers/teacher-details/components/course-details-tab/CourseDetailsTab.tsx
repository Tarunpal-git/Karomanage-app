import { StyleSheet } from "react-native";
import React, { FC, memo } from "react";
import Flex from "../../../../../@ui/flex/Flex";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import CourseDetailRow from "./CourseDetailRow";
import Center from "../../../../../@ui/center/Center";
import { COLORS } from "../../../../../colors";

interface ICourseDetailsTab {
  courses: TTeacherCourses[];
}

const CourseDetailsTab: FC<ICourseDetailsTab> = ({ courses }) => {
  const filteredCourseList = courses.filter(
    (obj) => Object.keys(obj).length > 0
  );
  return (
    <Flex mt={5}>
      <Grid>
        <Row style={styles.headerRow}>
          <Col size={25}>
            <ScalableText fontFamily="SemiBold" style={styles.headerText}>
              Course Name
            </ScalableText>
          </Col>
          <Col size={25}>
            <ScalableText fontFamily="SemiBold" style={styles.headerText}>
              {"Course\nFee"}
            </ScalableText>
          </Col>
          <Col size={30}>
            <ScalableText fontFamily="SemiBold" style={styles.headerText}>
              {"Max\nPayment\nInstallment"}
            </ScalableText>
          </Col>
          <Col size={20}>
            <ScalableText fontFamily="SemiBold" style={styles.headerText}>
              Course Status
            </ScalableText>
          </Col>
        </Row>
        {filteredCourseList.length === 0 && (
          <Center styles={{ minHeight: 350 }}>
            <ScalableText
              fontFamily="Medium"
              style={{ color: COLORS.black, fontSize: 14 }}
            >
              No data found
            </ScalableText>
          </Center>
        )}
        {filteredCourseList.map((course) => (
          <CourseDetailRow courseId={course.courseId} key={course.courseId} />
        ))}
      </Grid>
    </Flex>
  );
};

export default memo(CourseDetailsTab);

const styles = StyleSheet.create({
  headerRow: {
    borderBottomWidth: 1,
    borderColor: "#030303",
    paddingVertical: 20,
  },
  headerText: {
    color: "#1B1A1A",
    fontSize: 14,
  },
});
