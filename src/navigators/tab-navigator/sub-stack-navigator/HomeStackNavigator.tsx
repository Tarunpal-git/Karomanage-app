import React from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Dashboard from "../../../screens/dashboard";
import HomeScreen from "../../../screens/home";
import EnquiryLists from "../../../screens/enquiry/enquiry-lists";
import GenerateEnquiry from "../../../screens/enquiry/generate-enquiry";
import EnquiryDetails from "../../../screens/enquiry/enquiry-details";
import ViewEnquiry from "../../../screens/enquiry/view-enquiry";
import EditEnquiryDetails from "../../../screens/enquiry/edit-enquiry-details/EditEnquiryDetails";
import AssignManager from "../../../screens/assign-manager";
import StudentLists from "../../../screens/students/student-lists";
import StudentDetails from "../../../screens/students/student-details";
import StudentProfile from "../../../screens/students/student-profile";
import EditStudentScreen from "../../../screens/students/edit-student/EditStudentScreen";
import AddCourseToStudentScreen from "../../../screens/students/add-course-to-student/AddCourseToStudentScreen";
import LeadManagement from "../../../screens/lead-management";
import LeadManagementForms from "../../../screens/lead-management/forms";
import BatchList from "../../../screens/batches/batch-list";
import BatchDetails from "../../../screens/batches/batch-details";
import CourseLists from "../../../screens/courses/course-lists";
import CourseDetails from "../../../screens/courses/course-details";
import EmployeeList from "../../../screens/employee/employee-list";
import EmployeeSalaryDetails from "../../../screens/employee/employee-salary-details";
import EmployeeDetails from "../../../screens/employee/employee-details";
import TeacherList from "../../../screens/teachers/teacher-list";
import TeacherDetails from "../../../screens/teachers/teacher-details";
import TeacherProfileDetails from "../../../screens/teachers/teacher-profile-details";
import EmployeeAttendance from "../../../screens/attendance/employe-attendance";
import StudentBatchList from "../../../screens/attendance/student-batch-list";
import StudentAttendance from "../../../screens/attendance/student-attendance";
import Reports from "../../../screens/reports";
import FormsAssignManager from "../../../screens/lead-management/forms/assign-manager";
import FormEnquiries from "../../../screens/lead-management/forms/form-enquiries";
import EditFormTemplate from "../../../screens/lead-management/forms/edit-form-template";
import FormEnquiryDetails from "../../../screens/lead-management/forms/form-enquiry-details";
import UploadFormList from "../../../screens/lead-management/upload-forms/upload-forms-list";
import BulkDataList from "../../../screens/lead-management/upload-forms/bulk-data-list";
import BulkDataFormDetails from "../../../screens/lead-management/upload-forms/bulk-data-form-details";
import EmployeeSelfAttendance from "../../../screens/employee/employee-self-attendance";
import CreateBatch from '../../../screens/batches/create-batch';
import CreateCourse from '../../../screens/courses/create-course';
import StudentAdmissionStackNavigator from '../../../screens/students/student-admission/StudentAdmissionStackNavigator';
import UpdatePaymentScreen from '../../../screens/students/student-details/sections/payment-details/UpdatePaymentScreen';
import RefundPaymentScreen from '../../../screens/students/student-details/sections/payment-details/RefundPaymentScreen';
import AddCouponScreen from '../../../screens/students/student-admission/AddCouponScreen';
import TimetableScreen from "../../../screens/timetable";
import AddEmployee from "../../../screens/employee/add employee";
import HighestQualification from "../../../screens/employee/add employee/highest-qualification";
import EducationDetails from "../../../screens/employee/add employee/education-details";
import MonthlySalary from "../../../screens/employee/add employee/monthly-salary";
import BankDetails from "../../../screens/employee/add employee/bank-details";
import ReviewPage  from "../../../screens/employee/add employee/review-page"

const HomeStackNavigator = () => {
  const Stack = createNativeStackNavigator<THomeStackNavigatorParams>();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="EnquiryLists" component={EnquiryLists} />
      <Stack.Screen name="GenerateEnquiry" component={GenerateEnquiry} />
      <Stack.Screen name="EnquiryDetails" component={EnquiryDetails} />
      <Stack.Screen name="ViewEnquiry" component={ViewEnquiry} />
      <Stack.Screen name="EditEnquiryDetails" component={EditEnquiryDetails} />
      <Stack.Screen name="AssignManager" component={AssignManager} />
      <Stack.Screen name="StudentList" component={StudentLists} />
      <Stack.Screen name="StudentDetails" component={StudentDetails} />
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="EditStudent" component={EditStudentScreen} />
      <Stack.Screen name="AddCourseToStudent" component={AddCourseToStudentScreen} />
      <Stack.Screen name="LeadManagement" component={LeadManagement} />
      <Stack.Screen
        name="LeadManagementForms"
        component={LeadManagementForms}
      />

      <Stack.Screen name="BatchList" component={BatchList} />
      <Stack.Screen name="BatchDetails" component={BatchDetails} />
      <Stack.Screen name="CreateBatch" component={CreateBatch} />
      <Stack.Screen name="CourseList" component={CourseLists} />
      <Stack.Screen name="CourseDetails" component={CourseDetails} />
      <Stack.Screen name="CreateCourse" component={CreateCourse} />
      <Stack.Screen name="EmployeeList" component={EmployeeList} />
      <Stack.Screen
        name="EmployeeSalaryDetails"
        component={EmployeeSalaryDetails}
      />
      <Stack.Screen name="EmployeeDetails" component={EmployeeDetails} />
      <Stack.Screen name="EmployeeSelfAttendance" component={EmployeeSelfAttendance} />
      <Stack.Screen name="TeachersList" component={TeacherList} />
      <Stack.Screen
        name="TeacherProfileDetails"
        component={TeacherProfileDetails}
      />
      <Stack.Screen name="TeacherDetails" component={TeacherDetails} />

      <Stack.Screen name="EmployeeAttendance" component={EmployeeAttendance} />
      <Stack.Screen name="StudentBatchList" component={StudentBatchList} />
      <Stack.Screen name="StudentAttendance" component={StudentAttendance} />
      <Stack.Screen name="Reports" component={Reports} />
      <Stack.Screen name="Timetable" component={TimetableScreen} />
      <Stack.Screen name="FormEnquiries" component={FormEnquiries} />
      <Stack.Screen name="EditFormTemplate" component={EditFormTemplate} />
      <Stack.Screen name="FormsAssignManager" component={FormsAssignManager} />
      <Stack.Screen name="FormEnquiryDetails" component={FormEnquiryDetails} />

      {/* Payment Management Screens */}
      <Stack.Screen name="UpdatePayment" component={UpdatePaymentScreen} />
      <Stack.Screen name="RefundPayment" component={RefundPaymentScreen} />
      <Stack.Screen name="AddCoupon" component={AddCouponScreen} />

      <Stack.Screen
      name="AddEmployeeScreen"
      component={AddEmployee}
      options={{ headerShown: false }}
          />
           <Stack.Screen
       name="HighestQualification"
       component={HighestQualification}
       options={{ headerShown: false }}
     />
     <Stack.Screen
      name="EducationDetails"
      component={EducationDetails}
      options={{ headerShown: false }}
        />
        <Stack.Screen
       name="MonthlySalary"
       component={MonthlySalary}
       options={{ headerShown: false }}
       />
       <Stack.Screen
       name="BankDetails"
       component={BankDetails}
       options={{ headerShown: false }}
       />

      <Stack.Screen
       name="ReviewPage"
       component={ReviewPage}
       options={{ headerShown: false }}
        />
      

      {/* Upload data */}
      <Stack.Screen name="UploadFormList" component={UploadFormList} />
      <Stack.Screen name="BulkDataList" component={BulkDataList} />
      <Stack.Screen
        name="BulkDataFormDetails"
        component={BulkDataFormDetails}
      />
      <Stack.Screen name="StudentAdmission" component={StudentAdmissionStackNavigator} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;

export type THomeStackNavigator =
  NativeStackNavigationProp<THomeStackNavigatorParams>;
