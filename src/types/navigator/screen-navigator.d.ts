import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type TScreenNavigatorParams = {
  EnquiryLists: undefined;
  Dashboard: undefined;
  Home: undefined;
  Notifications: undefined;
  Profile: undefined;
  AdminDetails: undefined;
  OrganizationDetails: undefined;
  SwitchOrganization: undefined;
  GenerateEnquiry: undefined;
  EnquiryDetails: {
    id: string;
  };
  ViewEnquiry: {
    id: string;
  };
  EditEnquiryDetails: {
    id: string;
  };
  AssignManager: {
    leads?: TEnquiryData[];
  };
  StudentList: undefined;
  StudentDetails: {
    rollNo: string;
  };
  StudentProfile: {
    rollNo: string;
  };
  EditStudent: {
    studentData?: any;
  };
  AddCourseToStudent: {
    studentRollNo: string;
    studentDetails: TStudentList;
  };
  LeadManagement: undefined;
  LeadManagementForms: undefined;
  FormEnquiries: {
    formTemplateId: string;
  };
  EditFormTemplate: {
    formTemplateId: string;
  };
  BatchList: undefined;
  CourseList: undefined;
  BatchDetails: {
    batchId: string;
  };
  CourseDetails: {
    courseId: string;
    autoOpenEdit?: boolean;
  };

  CreateCourse: undefined;

  CreateBatch: undefined;

  EmployeeList: undefined;
  EmployeeDetails: {
    employeeId: string;
  };
  EmployeeSalaryDetails: {
    employeeId: string;
  };
  AddEmployeeScreen: undefined;

  TeachersList: undefined;
  TeacherDetails: {
    teacherId: string;
  };
  TeacherProfileDetails: {
    teacherId: string;
  };
  ExpensesLists: undefined;
  ExpensesStack: undefined;
  CreateExpense: undefined;
  ExpenseDetails: {
    expenseName: string;
    expenseId: string;
  };
  ExpenseCategoryDetails: {
    category: TExpenseCategories;
  };

  EmployeeAttendance: undefined;
  StudentBatchList: undefined;
  StudentAttendance: {
    batchId: string;
  };
  AttendanceCalendar: undefined;
  Reports: undefined;
  Timetable: undefined;
  BirthdayNotification: undefined;
  OverduePaymentsNotifications: undefined;
  ForecastDaysNotifications: undefined;
  LeadsNotifications: undefined;
  FormsAssignManager: {
    leads?: TFormEnquiry[];
    formTemplateId: string;
  };
  FormEnquiryDetails: {
    formTemplateId: string;
    leadId: string;
  };

  // Upload Data

  UploadFormList: undefined;
  UploadFormListEnquiries: {
    formTemplateId: string;
  };
  BulkDataList: {
    formTemplateId: string;
    customerId: string;
    organizationId: string;
    flag: "bulk" | "form" | "enquiry";
    lengthOfData: number;
    dataIndex: number;
    pageIndex: number;
  };

  BulkDataFormDetails: {
    formTemplateId: string;
    formId: string;
    metaFields: string;
  };
  EnquiryDetailsTab: {
    formTemplateId: string;
    formId: string;
    metaFields: string;
  };
  EmployeeSelfAttendance: undefined; // Use `undefined` or specify params if any
};

export type TScreenNavigator =
  NativeStackNavigationProp<TScreenNavigatorParams>;
