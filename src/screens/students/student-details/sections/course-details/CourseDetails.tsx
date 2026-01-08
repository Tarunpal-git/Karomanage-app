import { StyleSheet, TouchableOpacity } from "react-native";
import React, { FC, memo } from "react";
import Flex from "../../../../../@ui/flex/Flex";
import { Col, Grid, Row } from "react-native-easy-grid";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import CourseDetailRow from "./CourseDetailRow";
import Button from "../../../../../@ui/button/Button";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../../../types/navigator/screen-navigator";
import { COLORS } from "../../../../../colors";
import { hasUpdatePermission } from "../../../../../utils/fetchPermissionsTitle";

interface ICourseDetails {
  details: TStudentList;
  onCourseDeleted?: () => void;
}

const CourseDetails: FC<ICourseDetails> = ({ details, onCourseDeleted }) => {
  const navigation = useNavigation<TScreenNavigator>();

  const handleAddCourse = () => {
    navigation.navigate("AddCourseToStudent" as any, { 
      studentRollNo: details.rollNo,
      studentDetails: details 
    });
  };

  return (
    <Flex mt={15}>
      <Grid>
         {/* ADD COURSE Button below header */}
         {hasUpdatePermission("Student") && (
          <Row style={styles.addCourseRow}>
            <Col size={82}>
              {/* Empty space */}
            </Col>
            <Col size={18}>
              <Flex flexDirection="row" justify="flex-end">
                <Button
                  title="ADD COURSE"
                  onPress={handleAddCourse}
                  btnStyles={{ 
                    width: 100, 
                    height: 30, 
                    borderRadius: 6,
                    backgroundColor: COLORS.primary 
                  }}
                  btnTxtStyles={{ 
                    fontSize: 9, 
                    fontFamily: 'Poppins-Medium',
                    color: COLORS.white 
                  }}
                />
              </Flex>
            </Col>
          </Row>
         )}
        <Row style={styles.headerRow}>
          <Col size={24}>
            <ScalableText fontFamily="SemiBold" style={styles.headerText}>
              Course Name
            </ScalableText>
          </Col>
          <Col size={19}>
            <ScalableText fontFamily="SemiBold" style={styles.headerText}>
              Course Fee
            </ScalableText>
          </Col>
          <Col size={19}>
            <ScalableText fontFamily="SemiBold" style={styles.headerText}>
              Max Installment
            </ScalableText>
          </Col>
          <Col size={20}>
            <ScalableText fontFamily="SemiBold" style={styles.headerText}>
              Status
            </ScalableText>
          </Col>
          {hasUpdatePermission("Student") && (
            <Col size={18}>
              <ScalableText fontFamily="SemiBold" style={styles.headerText}>
                Actions
              </ScalableText>
            </Col>
          )}
        </Row>
        
       
        {details.courses.map((course) => (
          <CourseDetailRow 
            courseId={course.courseId} 
            key={course.courseId}
            studentRollNo={details.rollNo}
            onCourseDeleted={onCourseDeleted}
          />
        ))}
      </Grid>
    </Flex>
  );
};

export default memo(CourseDetails);

const styles = StyleSheet.create({
  headerRow: {
    borderBottomWidth: 1,
    borderColor: "#030303",
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  headerText: {
    color: "#1B1A1A",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  addCourseRow: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
