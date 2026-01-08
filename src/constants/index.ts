import Config from "react-native-config";

export const CONSTANT = {
  // FLAGS are now dynamic and fetched from API
  // Use useDynamicFlags hook instead of this hardcoded array
  FLAGS: [
    { label: "Select Flag", value: "" },
    { label: "Interested", value: "Interested" },
    { label: "Not Interested", value: "Not Interested" },
    { label: "Call later", value: "Call later" },
    { label: "Call not picked", value: "Call not picked" },
    { label: "Attend Demo", value: "Attend Demo" },
  ],

  ENQUIRY_STATUS: [
    { label: "Current Status", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inActive" },
    { label: "Delete", value: "delete" },
    { label: "Student", value: "student" },
  ],

  MONTHS: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

export const ORGANIZATION_PREFIX = `/organizationDetails${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const DASHBOARD_PREFIX = `/dashboard-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const ENQUIRY_PREFIX = `/EnquiryDetails${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const USER_MANAGEMENT_PREFIX = `/userManagement-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const STUDENT_PREFIX = `/student-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const BATCH_PREFIX = `/batch-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const ATTENDANCE_PREFIX = `/attendance-management-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const EMPLOYEES_PREFIX = `/employeeAdmission${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const REPORTS_PREFIX = `/reports-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const MAIL_SERVICE_PREFIX = `/email-services-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const TEACHER_PREFIX = `/teacher-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const COLLEGE_PREFIX = `/college-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const CUSTOMER_REGISTRATION_PREFIX = `/customer-registration${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const EXPENSES_PREFIX = `/inventories-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const TIME_TABLE_PREFIX = `/timeTable-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
export const CLASSROOM_PREFIX = `/classroom-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;
 

export const NOTIFICATION_HUB_PREFIX = `/notification-hub-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;

export const ORGANIZATION_INTEGRATIONS_PREFIX = `/organizationIntegrations-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;

export const AGENT_MANAGEMENT_PREFIX = `/agent-management-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;

export const LEAD_MANAGEMENT_PREFIX = `/leadManagement-fnp${
  Config.REACT_APP_MODE === "prod" ? "-prod" : ""
}/`;

export const TESTING_STUDENT_DATA = [
  {
    studentEnrollment: "T-1",
    studentName: "Tushar Kaushal",
    mobileNumber: "0987654321",
    email: "tushar12@gmail.com",
    studentStatus: "Active",
    paymentStatus: "Paid",
  },
  {
    studentEnrollment: "T-2",
    studentName: "Tushar Kaushal",
    mobileNumber: "0987654321",
    email: "tushar12@gmail.com",
    studentStatus: "Active",
    paymentStatus: "Paid",
  },
  {
    studentEnrollment: "T-8",
    studentName: "Tushar Kaushal",
    mobileNumber: "0987654321",
    email: "tushar12@gmail.com",
    studentStatus: "Active",
    paymentStatus: "Paid",
  },
  {
    studentEnrollment: "T-8",
    studentName: "Tushar Kaushal",
    mobileNumber: "0987654321",
    email: "tushar12@gmail.com",
    studentStatus: "Active",
    paymentStatus: "Paid",
  },
];
