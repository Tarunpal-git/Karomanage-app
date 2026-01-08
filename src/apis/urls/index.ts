import { attendanceUrls } from "./attendance.urls";
import { authApis } from "./auth.urls";
import { batchesUrls } from "./batches.url";
import { COLLEGE_URLS } from "./college.urls";
import { couponsUrls } from "./coupons.urls";
import { coursesUrls } from "./courses.url";
import { dashboardUrls } from "./dashboard.url";
import { emailServiceUrl } from "./email-service.urls";
import { employeeUrls } from "./employee.urls";
import { enquiryUrls } from "./enquiry.urls";
import { ExpensesUrls } from "./expenses.urls";
import { notificationsUrl } from "./notfications.url";
import { notificationUrls } from "./notifications.url";
import { moduleUrls } from "./modules.url";
import { organizationUrls } from "./organization.url";
import { reportsUrls } from "./reports.urls";
import { studentUrls } from "./students.url";
import { teacherUrls } from "./teachers.urls";
import { uploadFormsUrls } from "./uploadForms.urls";
import { userManagementUrls } from "./userManagement.url";
import { agentManagementUrls } from "./agentManagement.urls";
import { timeTableUrls } from "./timeTable.urls";
import { classroomUrls } from "./classroom.urls";
import { walletUrls } from "./wallet.urls";


export const apiUrls = {
  auth: authApis,
  organization: organizationUrls,
  dashboard: dashboardUrls,
  enquiry: enquiryUrls,
  userManagement: userManagementUrls,
  student: studentUrls,
  batch: batchesUrls,
  college: COLLEGE_URLS,
  coupons: couponsUrls,
  course: coursesUrls,
  attendance: attendanceUrls,
  employees: employeeUrls,
  emailServiceUrl: emailServiceUrl,
  reports: reportsUrls,
  teacher: teacherUrls,
  expenses: ExpensesUrls,
  notifications: notificationsUrl,
  notificationHub: notificationUrls,
  modules: moduleUrls,
  uploadedForms: uploadFormsUrls, // Ensure this includes the new API URL
  agentManagement: agentManagementUrls,
  timetable: timeTableUrls,
  classroom: classroomUrls,
  wallet: walletUrls,
};
