import { StyleSheet, View } from "react-native";
import React from "react";
import { COLORS } from "../../colors";

import AppLogo from "../../@ui/app-logo/AppLogo";
import Flex from "../../@ui/flex/Flex";
import DrawerMenu from "./DrawerMenu";
import { useNavigation } from "@react-navigation/native";

import { hasAnyPermissionSync } from "../../utils/fetchPermissionsTitle";
import { TScreenNavigator } from "../../types/navigator/screen-navigator";

const SideDrawer = () => {
  const navigation = useNavigation<TScreenNavigator>();
  
  return (
    <View style={styles.root}>
      <Flex mb={26}>
        <AppLogo size="small" orient="horizontal" />
      </Flex>
      <DrawerMenu
        Icon="dashboardIcon"
        heading="Dashboard"
        onClick={() => navigation.navigate("Dashboard")}
        hasPermission={hasAnyPermissionSync("Dashboard")}
      />
      <DrawerMenu
        Icon="reportsIcon"
        heading="Reports"
        onClick={() => navigation.navigate("Reports")}
        hasPermission={hasAnyPermissionSync("Reports")}
      />
      <DrawerMenu
        Icon="studentIcon"
        heading="Student"
        onClick={() => navigation.navigate("StudentList")}
        hasPermission={hasAnyPermissionSync("Student")}
      />
      <DrawerMenu
        Icon="attendanceIcon"
        heading="Attendance"
        onClick={() => navigation.navigate("EmployeeAttendance")}
        hasPermission={hasAnyPermissionSync("Attendance")}
      />
      <DrawerMenu
        Icon="enquiryIcon"
        heading="Enquiry"
        onClick={() => navigation.navigate("EnquiryLists")}
        hasPermission={hasAnyPermissionSync("Enquiry")}
      />
      <DrawerMenu
        Icon="leadManagementIcon"
        heading="Lead Management"
        onClick={() => navigation.navigate("LeadManagement")}
        hasPermission={hasAnyPermissionSync("Lead Management")}
      />
      <DrawerMenu
        Icon="courseIcon"
        heading="Courses"
        onClick={() => navigation.navigate("CourseList")}
        hasPermission={hasAnyPermissionSync("Courses")}
      />
      <DrawerMenu
        Icon="batchesIcon"
        heading="Batch"
        onClick={() => navigation.navigate("BatchList")}
        hasPermission={hasAnyPermissionSync("Batch")}
      />
      <DrawerMenu
        Icon="employeeIcon"
        heading="Employee"
        onClick={() => navigation.navigate("EmployeeList")}
        hasPermission={hasAnyPermissionSync("Employee")}
      />
      <DrawerMenu
        Icon="teacherIcon"
        heading="Teacher"
        onClick={() => navigation.navigate("TeachersList")}
        hasPermission={hasAnyPermissionSync("Teacher")}
      />
      <DrawerMenu
        Icon="expensesIcon"
        heading="Expenses"
        onClick={() => navigation.navigate("ExpensesStack")}
        hasPermission={hasAnyPermissionSync("Expenses")}
      />
      <DrawerMenu
        Icon="timetableIcon"
        heading="Timetable"
        onClick={() => navigation.navigate("Timetable")}
        hasPermission={hasAnyPermissionSync("Timetable")}
      />
    </View>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
    padding: 30,
  },
});
