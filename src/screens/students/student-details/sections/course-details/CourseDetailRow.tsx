import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { FC, memo, useMemo } from "react";
import { Col, Row } from "react-native-easy-grid";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import Flex from "../../../../../@ui/flex/Flex";
import { useCourseDetailsQuery } from "../../../../../apis/hooks/course/query/useCourseDetails.query";
import { useRemoveCourseStudentMutation } from "../../../../../apis/hooks/students/mutation/useRemoveCourseStudent.mutation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../app/store";
import { COLORS } from "../../../../../colors";
import { hasUpdatePermission } from "../../../../../utils/fetchPermissionsTitle";

interface ICourseDetailRow {
  courseId: string;
  studentRollNo: string;
  onCourseDeleted?: () => void;
}

const CourseDetailRow: FC<ICourseDetailRow> = ({ courseId, studentRollNo, onCourseDeleted }) => {
  const { data, isLoading } = useCourseDetailsQuery({ courseId });
  const { mutateAsync: removeCourse, isPending } = useRemoveCourseStudentMutation();
  
  // Get auth user and organization details from Redux at component level
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { organization } = useSelector((state: RootState) => state.organization);

  const course: TCourseData = useMemo(() => {
    if (!isLoading && data?.data) {
      return data.data;
    } else {
      return undefined;
    }
  }, [data, isLoading]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Course",
      `Are you sure you want to remove "${course?.courseName}" from this student?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const payload = {
                user: {
                  userCustomerId: authUser?.customerId || '',
                  userCustomerName: authUser?.customerName || '',
                  userCustomerEmail: authUser?.customerEmail || '',
                  roleName: organization?.role?.roleName || '',
                  roleId: organization?.role?.roleId || '', 
                  userEmployeeId: selectedOrganization?.organizationId || '',
                },
                customerId: selectedOrganization?.customerId || '',
                organizationId: selectedOrganization?.organizationId || '',
                rollNo: studentRollNo,
                courseId: courseId,
              };

              await removeCourse(payload);
              Alert.alert("Success", "Course removed successfully!");
              
              // Call the callback to refresh student details
              if (onCourseDeleted) {
                onCourseDeleted();
              }
            } catch (error) {
              console.error('Remove course error:', error);
              Alert.alert("Error", "Failed to remove course");
            }
          }
        }
      ]
    );
  };

  // Show loading state if data is not available
  if (isLoading || !course) {
    return (
      <Row style={styles.dataRow}>
        <Col size={24}>
          <ScalableText fontFamily="Regular" style={styles.courseNameText}>
            Loading...
          </ScalableText>
        </Col>
        <Col size={19}>
          <ScalableText fontFamily="Regular" style={styles.dataText}>
            -
          </ScalableText>
        </Col>
        <Col size={19}>
          <ScalableText fontFamily="Regular" style={styles.dataText}>
            -
          </ScalableText>
        </Col>
        <Col size={20}>
          <Flex
            styles={styles.statusChip}
          >
            <ScalableText style={styles.statusChipText} fontFamily="Medium">
              -
            </ScalableText>
          </Flex>
        </Col>
        {hasUpdatePermission("Student") && (
          <Col size={18}>
            <Flex flexDirection="row" justify="center" align="center">
              <TouchableOpacity disabled style={styles.deleteButton}>
                <ScalableText style={styles.deleteButtonText} fontFamily="Medium">
                  DELETE
                </ScalableText>
              </TouchableOpacity>
            </Flex>
          </Col>
        )}
      </Row>
    );
  }

  return (
    <Row style={styles.dataRow}>
      <Col size={24}>
        <ScalableText 
          fontFamily="Regular" 
          style={styles.courseNameText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {course?.courseName || '-'}
        </ScalableText>
      </Col>
      <Col size={19}>
        <ScalableText fontFamily="Regular" style={styles.dataText}>
          {course?.courseFee ? course.courseFee.toLocaleString('en-IN') : '-'}
        </ScalableText>
      </Col>
      <Col size={19}>
        <ScalableText fontFamily="Regular" style={styles.dataText}>
          {course?.maxPaymentInstallment || '-'}
        </ScalableText>
      </Col>
      <Col size={20}>
        <Flex
          styles={{
            ...styles.statusChip,
            backgroundColor:
              course?.courseStatus === "active" ? "#ECFFE0" : "#FFE3E3",
          }}
        >
          <ScalableText
            style={{
              ...styles.statusChipText,
              color: course?.courseStatus === "active" ? "#4AC400" : "#FF6363",
            }}
            fontFamily="Medium"
          >
            {course?.courseStatus}
          </ScalableText>
        </Flex>
      </Col>
      {hasUpdatePermission("Student") && (
        <Col size={18}>
          <Flex flexDirection="row" justify="center" align="center">
            <TouchableOpacity 
              onPress={handleDelete}
              disabled={isPending}
              style={styles.deleteButton}
            >
              <ScalableText style={styles.deleteButtonText} fontFamily="Medium">
                {isPending ? "..." : "DELETE"}
              </ScalableText>
            </TouchableOpacity>
          </Flex>
        </Col>
      )}
    </Row>
  );
};

export default memo(CourseDetailRow);

const styles = StyleSheet.create({
  statusChip: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    minHeight: 28,
  },
  statusChipText: {
    fontSize: 11,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  dataRow: {
    borderBottomWidth: 1,
    borderColor: "#D1D1D1",
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  dataText: {
    color: "#1B1A1A",
    fontSize: 12,
    textAlign: "center",
    textTransform: "capitalize",
    lineHeight: 16,
  },
  courseNameText: {
    color: "#1B1A1A",
    fontSize: 11,
    textAlign: "center",
    textTransform: "capitalize",
    lineHeight: 14,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: 60,
    minHeight: 28,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 8,
    textAlign: 'center',
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});
