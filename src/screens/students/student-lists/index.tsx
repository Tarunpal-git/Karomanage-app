import React, { useMemo, useState, useEffect } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import Flex from "../../../@ui/flex/Flex";
import SearchBar from "../../../@ui/search-bar/SearchBar";
import FilterButton from "./component/FilterButton";
import PaymentCards from "./component/PaymentCards";
import { Col, Grid } from "react-native-easy-grid";
import StudentFilterSelect from "./component/StudentFilterSelect";
import GridTable from "../../../@ui/table/GridTable";
import { studentColumns } from "./component/tableColumns";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import { View, StyleSheet } from "react-native";
import { TTableColumns } from "../../../types/table/tableColomuns";

import { useStudentsListQuery } from "../../../apis/hooks/students/query/useStudentsList.query";
import { useCourseListsQuery } from "../../../apis/hooks/course/query/useCourseLists.query";
import { useBatchListsQuery } from "../../../apis/hooks/batch/query/useBatchLists.query";
import { filteredStudentData } from "./utils/filteredStudentData";
import Avatar from "../../../@ui/avatar/Avatar";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import Button from "../../../@ui/button/Button";
import PaymentRestrictionNotice from "../../../@ui/restriction/PaymentRestrictionNotice";
import { hasCreatePermission, hasOnlyReadPermission } from "../../../utils/fetchPermissionsTitle";

const StudentLists = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const route = useRoute();
  const hidePaymentInfo = hasOnlyReadPermission("Student");

  const { data: courseData } = useCourseListsQuery();
  const { data: batchData } = useBatchListsQuery();

  // getting select values for course data

  const COURSES_LIST: TSelectOptions[] = useMemo(() => {
    return courseData?.data
      ? courseData.data.map((course: TCourseData) => ({
          label: course.courseName,
          value: course.courseId,
        }))
      : [];
  }, [courseData]);

  const BATCHES_LIST: TSelectOptions[] = useMemo(() => {
    return batchData?.data
      ? batchData.data.map((batch: TBatchData) => ({
          label: batch.batchName,
          value: batch.batchId,
        }))
      : [];
  }, [batchData]);

  const [filters, setFilters] = useState({
    search: "",
    studentStatus: "",
    paymentStatus: "",
    courseName: "",
    batchName: "",
  });

  const [visibleColumns, setVisibleColumns] = useState<
    { label: string; key: string }[]
  >([
    { label: "Student Enrollment", key: "studentEnrollment" },
    { label: "Student Name", key: "studentName" },
    { label: "Mobile Number", key: "studentContact" },
  ]);

  const tableColumns = useMemo(() => {
    const columns = [...studentColumns];

    // Perform the unshift operation on the copied array
    columns.unshift({
      key: "studentEnrollment",
      label: "Student Enrollment",
      field: "studentEnrollment",
      minWidth: 130,
      hidden: true,
      renderCell: (row) => (
        <Flex>
          <Avatar content={row.studentEnrollmentNumber} />
          <ScalableText
            fontFamily="Regular"
            style={{ fontSize: 12, marginLeft: 5 }}
          >
            {row.studentEnrollmentNumber}
          </ScalableText>
        </Flex>
      ),
    });
    return columns.filter((column) =>
      visibleColumns.some((visibleColumn) => visibleColumn.key === column.key)
    );
  }, [visibleColumns, studentColumns]);

  const { isLoading, data, refetch } = useStudentsListQuery({
    studentStatus: filters.studentStatus || undefined,
    paymentStatus: filters.paymentStatus || undefined,
    courseName: filters.courseName || undefined,
    batchName: filters.batchName || undefined,
  });

  // Handle refresh parameter from navigation
  useEffect(() => {
    const params = route.params as { refresh?: boolean } | undefined;
    if (params?.refresh) {
      console.log('🔄 Refreshing student list due to new admission');
      refetch();
      // Clear the refresh parameter
      navigation.setParams({ refresh: undefined });
    }
  }, [route.params, refetch, navigation]);

  // Refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 Screen focused, refreshing student list');
      refetch();
    });

    return unsubscribe;
  }, [navigation, refetch]);

  const studentsList: TStudentList[] = useMemo(() => {
    if (!isLoading && data && data.statuscode === 200 && Array.isArray(data.data)) {
      // New API studentFilterListV2 can return a summary object as first element.
      // Filter out any entries that don't look like real student records.
      const raw = data.data as any[];
      const onlyStudents = raw.filter(
        (item) =>
          item &&
          (item.studentEnrollmentNumber || item.rollNo || item.studentFirstName)
      );

      return filteredStudentData(onlyStudents as unknown as TStudentList[], filters);
    } else {
      return [];
    }
  }, [isLoading, data, filters]);

  const totalPaymentDetails = useMemo(() => {
    // 1) Try to use new summary fields from studentFilterListV2 (backend sample)
    // Expected shape:
    // data: [{ totalReceivedPayment, totalDuePayment, ... }]
    const summary = Array.isArray(data?.data) ? (data!.data as any[])[0] : undefined;

    if (summary && typeof summary.totalReceivedPayment === "number" && typeof summary.totalDuePayment === "number") {
      return {
        totalReceivedPayment: summary.totalReceivedPayment,
        totalDuePayment: summary.totalDuePayment,
      };
    }

    // 2) Fallback to old logic using per-student allPaymentDetails
    let totalReceivedPayment = 0;
    let totalDuePayment = 0;

    studentsList.forEach((student) => {
      if (filters.courseName) {
        student.courses.forEach((course) => {
          if (course.courseId === filters.courseName && course.paymentDetails) {
            totalDuePayment += course.paymentDetails.totalDuePayment || 0;
            totalReceivedPayment +=
              (course.paymentDetails.totalReceivedPayment || 0) -
              (course.paymentDetails.refundAmount || 0); // Subtract refund;
          }
        });
      } else if (student.allPaymentDetails) {
        totalDuePayment += student.allPaymentDetails.totalDuePayment || 0;
        totalReceivedPayment +=
          (student.allPaymentDetails.totalReceivedPayment || 0) -
          (student.allPaymentDetails.grandRefundAmount || 0); // Subtract refund;
      }
    });

    return {
      totalReceivedPayment,
      totalDuePayment,
    };
  }, [studentsList, filters, data]);

  return (
    <SafeView>
      <AppHeader
        title="Student List"
        handleBackClick={() => navigation.navigate("Home")}
      />
      <Flex mx={25} my={14}>
        <SearchBar
          value={filters.search}
          onChange={(e) =>
            setFilters((previous) => ({ ...previous, search: e }))
          }
        />
        <FilterButton
          setVisibleColumns={setVisibleColumns}
          visibleColumns={visibleColumns}
        />
      </Flex>

      {/* Add Student Button - right after search bar */}
      {hasCreatePermission("Student") && (
        <Flex mb={2} mt={2} flexDirection="row" justify="flex-end" mx={25}>
          <Button
            title="Add Student"
            onPress={() => navigation.navigate("StudentAdmission" as any)}
            btnStyles={{ width: 110, height: 34, borderRadius: 8 }}
            btnTxtStyles={{ fontSize: 13, fontFamily: 'Poppins-Medium' }}
          />
        </Flex>
      )}

      {hidePaymentInfo ? (
        <PaymentRestrictionNotice
          variant="inline"
          containerStyle={{ marginHorizontal: 25, marginBottom: 10 }}
          description="You don’t have permission to view the course payments."
        />
      ) : (
        <Flex mx={25}>
          <PaymentCards
            containerStyles={{ marginRight: 7 }}
            amount={totalPaymentDetails.totalReceivedPayment}
            textVariant="success"
            title="Received Payment"
          />

          <PaymentCards
            containerStyles={{ marginLeft: 7 }}
            amount={totalPaymentDetails.totalDuePayment}
            textVariant="error"
            title="Due Payment"
          />
        </Flex>
      )}
      <View style={{ marginBottom: 25 }}>
        <Grid
          style={{
            flexWrap: "wrap",
            marginHorizontal: 10,
            marginVertical: 30,
          }}
        >
          <Col>
            <StudentFilterSelect
              onChange={(e) =>
                setFilters((previous) => ({ ...previous, studentStatus: e }))
              }
              label="Student Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inActive" },
                { label: "Defaulter", value: "defaulter" },
              ]}
            />
          </Col>
          <Col>
            <StudentFilterSelect
              onChange={(e) =>
                setFilters((previous) => ({ ...previous, paymentStatus: e }))
              }
              label="Payment Status"
              options={[
                { label: "Paid", value: "paid" },
                { label: "Due", value: "due" },
              ]}
            />
          </Col>
          <Col>
            <StudentFilterSelect
              onChange={(e) =>
                setFilters((previous) => ({ ...previous, courseName: e }))
              }
              label="Course Name"
              options={COURSES_LIST}
            />
          </Col>
          <Col>
            <StudentFilterSelect
              onChange={(e) =>
                setFilters((previous) => ({ ...previous, batchName: e }))
              }
              label="Batch Name"
              options={BATCHES_LIST}
            />
          </Col>
        </Grid>
      </View>

      <ThemeScrollView paddingHorizontal={12} reloadData={refetch}>
        <Flex styles={{ marginBottom: 20 }}>
          <GridTable
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={studentsList}
            columns={tableColumns as TTableColumns<unknown>[]}
            isLoading={false}
            columnHeight={50}
            headerHeight={75}
            fixedFirstElement
            handleRowClick={(e: unknown) => {
              const data = e as TStudentList;
              navigation.navigate("StudentDetails", { rollNo: data.rollNo });
            }}
          />
        </Flex>
      </ThemeScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  // Removed fab styles since we're using regular button now
});

export default StudentLists;
