import { StyleSheet } from "react-native";
import React, { FC, memo, useMemo, useEffect } from "react";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import AnimatedCounter from "../../../@ui/animated-views/AnimatedCounter";
import { COLORS } from "../../../colors";
import { useParallelStudentsQuery } from "../../../apis/hooks/students/query/useParallelStudents.query";
import { useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../../../apis/urls";

import { TTableColumns } from "../../../types/table/tableColomuns";
import { studentColumns } from "../../students/student-lists/component/tableColumns";
import GridTable from "../../../@ui/table/GridTable";
import Avatar from "../../../@ui/avatar/Avatar";
import { filteredPaymentOverviewBatchDetails } from "./utils/filteredPaymentOverviewBatchDetails";
import PaymentRestrictionNotice from "../../../@ui/restriction/PaymentRestrictionNotice";
import { hasOnlyReadPermission } from "../../../utils/fetchPermissionsTitle";

interface IBatchPaymentOverviewDetails {
  students: TBatchStudent[];
  courses: string[];
}

const BatchPaymentOverviewDetails: FC<IBatchPaymentOverviewDetails> = ({
  students,
  courses,
}) => {
  const queryClient = useQueryClient();
  const studentsList: TStudentList[] = useParallelStudentsQuery(students);
  console.log("Students List:", studentsList);
  const hidePaymentInfo = hasOnlyReadPermission("Batch");

  // Invalidate student queries to ensure fresh data
  useEffect(() => {
    console.log("🔄 Invalidating student queries to ensure fresh data...");
    queryClient.invalidateQueries({ queryKey: [apiUrls.student.FETCH_STUDENT_DETAILS] });
  }, [queryClient]);

  const tableColumns = [...studentColumns];

  tableColumns.unshift({
    key: "studentEnrollment",
    field: "studentEnrollmentNumber",
    label: "Student Enrollment",
    minWidth: 130,
    hidden: true,
    renderCell: (row) => (
      <Flex>
        <Avatar content={row?.studentEnrollmentNumber ?? ""} />
        <ScalableText
          fontFamily="Regular"
          style={{ fontSize: 12, marginLeft: 5 }}
        >
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
      const course = row?.courses?.filter((course) =>
        courses.includes(course.courseId)
      );

      return (
        <ScalableText
          fontFamily="SemiBold"
          style={{
            fontSize: 12,
            marginLeft: 5,
            textTransform: "capitalize",
            color:
              course?.[0].paymentDetails.coursePaymentStatus === "due"
                ? COLORS.textError
                : COLORS.textSuccess,
          }}
        >
          {course?.[0].paymentDetails.coursePaymentStatus}
        </ScalableText>
      );
    },
  });

  const paymentCardDetails = useMemo(() => {
    if (studentsList.length > 0) {
      const paymentDetails = filteredPaymentOverviewBatchDetails(studentsList, courses);
  
      console.log("Original Received Payment:", paymentDetails.receivedPayment);
      console.log("Refund Amount:", paymentDetails.refundAmount);
      console.log("Defaulter Students Count:", paymentDetails.defaulterStudents);
      console.log("Students with studentStatus 'defaulter':", studentsList.filter(student => 
        student?.studentStatus === "defaulter"
      ).length);
      console.log("Overdue Payment Amount:", paymentDetails.duePayment);
  
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
        forecastPayment: 0,
        receivedPayment: 0,
        duePayment: 0,
        defaulterStudents: 0,
      };
    }
  }, [studentsList, courses]);
  



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
              textStyles={{ marginLeft: 2, color: COLORS.textError }}
            />
          </Flex>
        </Flex>
      </Flex>
      {hidePaymentInfo ? (
        <PaymentRestrictionNotice containerStyle={{ marginTop: 20 }} />
      ) : (
        <Flex mt={20}>
          <Flex flexDirection="column" styles={styles.paymentCard}>
            <ScalableText style={styles.paymentCardTitle} fontFamily="Medium">
              Upcoming payment
            </ScalableText>
            <Flex>
              <AutoHeightImage
                source={IMAGES.forecastPaymentCardIcon}
                width={25}
              />
              <Flex ml={2}>
                <AutoHeightImage source={IMAGES.rupee} width={7} />
                <AnimatedCounter
                  duration={800}
                  endValue={paymentCardDetails.forecastPayment}
                  textStyles={{ marginLeft: 2 }}
                />
              </Flex>
            </Flex>
          </Flex>
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
              Overdue payment
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
      )}

      <GridTable
        data={studentsList
          .filter((student) => student?.studentStatus !== "delete")
          .sort((a, b) => b.dateCreated - a.dateCreated) // Sort by newest first
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

export default memo(BatchPaymentOverviewDetails);

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
