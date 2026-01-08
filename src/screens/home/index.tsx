import React from "react";
import AppHeader from "../../@ui/app-header/AppHeader";
import SafeView from "../../@ui/safe-view/SafeView";
import ThemeScrollView from "../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../@ui/flex/Flex";
import FeatureCard from "./components/FeatureCard";
import { hasAnyPermissionSync, debugOwnerStatus, debugAllPermissions } from "../../utils/fetchPermissionsTitle";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../types/navigator/screen-navigator";
import AsyncStorage from "@react-native-async-storage/async-storage";





const HomeScreen = () => {
  const navigation = useNavigation<TScreenNavigator>();
  
  // Temporary debug - remove this after testing
  React.useEffect(() => {
    console.log("=== TESTING OWNER LOGIC ===");
     // Properly handle AsyncStorage Promise
     const logOrganizationData = async () => {
       try {
         const organizationData = await AsyncStorage.getItem('organization');
         const parsedData = organizationData ? JSON.parse(organizationData) : null;
         console.log("Tarun-organization (raw):", organizationData);
         console.log("Tarun-organization (parsed):", parsedData);
         console.log("Organization ID:", parsedData?.organizationId);
         console.log("Organization Name:", parsedData?.organizationName);
         console.log("Customer ID:", parsedData?.customerId);
         console.log("Role:", parsedData?.role);
         console.log("Subscription:", parsedData?.subscription);
       } catch (error) {
         console.error("Error parsing organization data:", error);
       }
     };
     logOrganizationData();
       debugOwnerStatus();
       debugAllPermissions();
    // console.log("Dashboard permission:", hasAnyPermission("Dashboard"));
    // console.log("Student permission:", hasAnyPermissionSync("Student"));
    // console.log("Employee permission:", hasAnyPermissionSync("Employee"));
    // console.log("Teacher permission:", hasAnyPermissionSync("Teacher"));
    // console.log("Courses permission:", hasAnyPermissionSync("Courses"));
    // console.log("Batch permission:", hasAnyPermissionSync("Batch"));
    // console.log("Expenses permission:", hasAnyPermissionSync("Expenses"));
    // console.log("Reports permission:", hasAnyPermissionSync("Reports"));
    console.log("Timetable permission:", hasAnyPermissionSync("Timetable"));
    console.log("=== END TESTING OWNER LOGIC ===");
  }, []);

  return (
    <SafeView>
      <AppHeader title="" />
      <ThemeScrollView paddingHorizontal={16}>
        <Flex
          justify="space-between"
          styles={{ flexWrap: "wrap", paddingBottom: 80 }}
        >
          <FeatureCard
            feature="Dashboard"
            icon="dashboardFeature"
            show={hasAnyPermissionSync("Dashboard")}
            handleClick={() => navigation.navigate("Dashboard")}
          />
          <FeatureCard
            feature="Student"
            icon="studentFeature"
            imageWidth={64}
            show={hasAnyPermissionSync("Student")}
            handleClick={() => navigation.navigate("StudentList")}
          />
          <FeatureCard
            feature="Attendance"
            icon="attendanceFeature"
            imageWidth={49}
            show={hasAnyPermissionSync("Attendance")}
            handleClick={() => navigation.navigate("EmployeeAttendance")}
          />
          <FeatureCard
            feature="Enquiry"
            icon="enquiryFeature"
            imageWidth={71}
            show={hasAnyPermissionSync("Enquiry")}
            handleClick={() => navigation.navigate("EnquiryLists")}
          />
          <FeatureCard
            feature={`Lead ${"\n"} Management`}
            icon="leadManagementFeature"
            imageWidth={58}
            show={hasAnyPermissionSync("Lead Management")}
            handleClick={() => navigation.navigate("LeadManagement")}
          />
          <FeatureCard
            feature="Batch"
            icon="batchesFeature"
            imageWidth={56}
            show={hasAnyPermissionSync("Batch")}
            handleClick={() => navigation.navigate("BatchList")}
          />
          <FeatureCard
            feature="Courses"
            icon="courseFeature"
            imageWidth={70}
            show={hasAnyPermissionSync("Courses")}
            handleClick={() => navigation.navigate("CourseList")}
          />
          <FeatureCard
            feature="Employee"
            icon="employeeFeature"
            imageWidth={60}
            show={hasAnyPermissionSync("Employee")}
            handleClick={() => navigation.navigate("EmployeeList")}
          />
          <FeatureCard
            feature="Teacher"
            icon="teacherFeature"
            imageWidth={64}
            show={hasAnyPermissionSync("Teacher")}
            handleClick={() => navigation.navigate("TeachersList")}
          />
          <FeatureCard
            feature="Expenses"
            icon="expensesFeature"
            imageWidth={61}
            show={hasAnyPermissionSync("Expenses")}
            handleClick={() => navigation.navigate("ExpensesStack")}
          />
             <FeatureCard
            feature="Timetable"
            icon="timetableFeature"
            imageWidth={64}
            show={hasAnyPermissionSync("Timetable")}
            handleClick={() => navigation.navigate("Timetable")}
          />
          <FeatureCard
            feature="Reports"
            icon="reportsFeature"
            imageWidth={74}
            show={hasAnyPermissionSync("Reports")}
            handleClick={() => navigation.navigate("Reports")}
          />
        </Flex>
      </ThemeScrollView>
    </SafeView>
  );
};

export default HomeScreen;

