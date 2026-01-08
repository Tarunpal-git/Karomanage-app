import { StyleSheet } from "react-native";
import React, { FC, memo, useMemo } from "react";
import Flex from "../../../../@ui/flex/Flex";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import AnimatedCounter from "../../../../@ui/animated-views/AnimatedCounter";
import { COLORS } from "../../../../colors";
import { useParallelStudentsQuery } from "../../../../apis/hooks/students/query/useParallelStudents.query";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import { studentColumns } from "../../../students/student-lists/component/tableColumns";
import GridTable from "../../../../@ui/table/GridTable";
import Avatar from "../../../../@ui/avatar/Avatar";
import { filteredCoursesPaymentOverviewCourseDetails } from "./filteredCoursesPaymentOverviewCourseDetails";
import PaymentRestrictionNotice from "../../../../@ui/restriction/PaymentRestrictionNotice";
import { hasOnlyReadPermission } from "../../../../utils/fetchPermissionsTitle";

interface ICoursesPaymentOverviewDetails {
  students: TBatchStudent[];
  courseId: string;
}

const CoursesPaymentOverviewDetails: FC<ICoursesPaymentOverviewDetails> = ({ students, courseId }) => {
  const studentsList: TStudentList[] = useParallelStudentsQuery(students);
  console.log("Students List:", studentsList);
  const hidePaymentInfo = hasOnlyReadPermission("Courses");

  const tableColumns = [...studentColumns];
  tableColumns.unshift({
    key: "studentEnrollment",
    field: "studentEnrollment",
    label: "Student Enrollment",
    minWidth: 130,
    hidden: true,
    renderCell: (row) => (
      <Flex>
        <Avatar content={row?.studentEnrollmentNumber ?? ""} />
        <ScalableText fontFamily="Regular" style={{ fontSize: 12, marginLeft: 5 }}>
          {row?.studentEnrollmentNumber}
        </ScalableText>
      </Flex>
    ),
  });

  tableColumns.push({
    key: "paymentStatus",
    field: "paymentStatus",
    label: "Payment Status",
    minWidth: 120,
    renderCell: (row) => {
      const course = row?.courses?.find((course) => course.courseId === courseId);
      return (
        <ScalableText
          fontFamily="SemiBold"
          style={{
            fontSize: 12,
            marginLeft: 5,
            textTransform: "capitalize",
            color: course?.paymentDetails.coursePaymentStatus === "due" ? COLORS.textError : COLORS.textSuccess,
          }}
        >
          {course?.paymentDetails.coursePaymentStatus}
        </ScalableText>
      );
    },
  });

const paymentCardDetails = useMemo(() => {
    if (studentsList.length > 0) {
      const paymentDetails = filteredCoursesPaymentOverviewCourseDetails(studentsList, [courseId]);
  
      console.log("Original Received Payment:", paymentDetails.receivedPayment);
      console.log("Refund Amount:", paymentDetails.refundAmount);
  
      const adjustedReceivedPayment = paymentDetails.receivedPayment - paymentDetails.refundAmount;
      console.log("Adjusted Received Payment:", adjustedReceivedPayment);
  
      return {
        ...paymentDetails,
        receivedPayment: adjustedReceivedPayment,
      };
    } else {
      return {
        activeStudents: 0,
        inactiveStudents: 0,
        defaulterStudents: 0,
        forecastPayment: 0,
        receivedPayment: 0,
        duePayment: 0,
      };
    }
  }, [studentsList,courseId]);

  return (
    <React.Fragment>
      <Flex mt={20}>
        <Flex flexDirection="column" styles={styles.paymentCard}>
          <ScalableText style={styles.paymentCardTitle} fontFamily="Medium">
            Active Students
          </ScalableText>
          <Flex>
            <AutoHeightImage source={IMAGES.activeStudentCardIcon} width={25} />
            <AnimatedCounter
              duration={800}
              endValue={paymentCardDetails.activeStudents}
              textStyles={{ marginLeft: 2 }}
            />
          </Flex>
        </Flex>
        <Flex flexDirection="column" styles={styles.paymentCard}>
          <ScalableText style={styles.paymentCardTitle} fontFamily="Medium">
            Inactive Students
          </ScalableText>
          <Flex>
            <AutoHeightImage
              source={IMAGES.inactiveStudentCardIcon}
              width={25}
            />
            <AnimatedCounter
              duration={800}
              endValue={paymentCardDetails.inactiveStudents}
              textStyles={{ marginLeft: 2 }}
            />
          </Flex>
        </Flex>
        <Flex flexDirection="column" styles={styles.paymentCard}>
          <ScalableText style={styles.paymentCardTitle} fontFamily="Medium">
            Defaulter Students
          </ScalableText>
          <Flex>
            <AutoHeightImage
              source={IMAGES.overduePaymentCardIcon}
              width={25}
            />
            <AnimatedCounter
              duration={800}
              endValue={paymentCardDetails.defaulterStudents}
              textStyles={{ marginLeft: 2 }}
            />
          </Flex>
        </Flex>
      </Flex>
      {hidePaymentInfo ? (
        <PaymentRestrictionNotice containerStyle={{ marginVertical: 20 }} />
      ) : (
        <>
          <Flex my={20}>
            <Flex flexDirection="column" styles={styles.paymentCard}>
              <ScalableText style={styles.paymentCardTitle} fontFamily="Medium">
                Upcoming Payment
              </ScalableText>
              <Flex>
                <AutoHeightImage
                  source={IMAGES.forecastPaymentCardIcon}
                  width={25}
                />
                <Flex ml={2}>
                  <AutoHeightImage source={IMAGES.rupee} width={7}/>
                  <AnimatedCounter
                    duration={800}
                    endValue={paymentCardDetails.forecastPayment}
                    textStyles={{ marginLeft: 2 }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex my={20}>
            <Flex flexDirection="column" styles={styles.paymentCard}>
              <ScalableText style={styles.paymentCardTitle} fontFamily="Medium">
                Received Payment
              </ScalableText>
              <Flex>
                <AutoHeightImage
                  source={IMAGES.receivedPaymentCardIcon}
                  width={25}
                />
                <Flex ml={2}>
                  <AutoHeightImage source={IMAGES.rupee} width={7} />
                  <AnimatedCounter
                    duration={800}
                    endValue={paymentCardDetails.receivedPayment}
                    textStyles={{ marginLeft: 2 }}
                  />
                </Flex>
              </Flex>
            </Flex>
            <Flex flexDirection="column" styles={styles.paymentCard}>
              <ScalableText style={styles.paymentCardTitle} fontFamily="Medium">
                Overdue Payment
              </ScalableText>
              <Flex>
                <AutoHeightImage
                  source={IMAGES.overduePaymentCardIcon}
                  width={25}
                />
                <Flex ml={2}>
                  <AutoHeightImage source={IMAGES.rupee} width={7} />
                  <AnimatedCounter
                    duration={800}
                    endValue={paymentCardDetails.duePayment}
                    textStyles={{ marginLeft: 2 }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
      <GridTable
        data={studentsList
          .filter((student) => student?.studentStatus !== "delete")
          .sort((a, b) => {
            // Sort by dateCreated in descending order (newest first)
            const dateA = a?.dateCreated || 0;
            const dateB = b?.dateCreated || 0;
            return dateB - dateA;
          })
        }
        columns={tableColumns as TTableColumns<unknown>[]}
        isLoading={false}
        columnHeight={50}
        headerHeight={75}
        fixedFirstElement
      />
 </React.Fragment>
  );
};

export default memo(CoursesPaymentOverviewDetails);

const styles = StyleSheet.create({
  paymentCard: {
    backgroundColor: COLORS.white,
    elevation: 4,
    padding: 15,
    borderRadius: 10,
    flex: 1,
    margin: 2,
  },
  paymentCardTitle: {
    fontSize: 12,
    color: "#A0A0A0",
    textAlign: "center",
    marginBottom: 5,
  },
});
