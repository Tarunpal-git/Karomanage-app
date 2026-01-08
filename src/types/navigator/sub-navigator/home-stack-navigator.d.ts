type THomeStackNavigatorParams = {
  Dashboard: undefined;
  Home: undefined;
  EnquiryLists: undefined;
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
  CreateBatch: undefined;
  CreateCourse: undefined;
  AddCoupon: {
    returnScreen?: string;
  };
  UpdatePayment: {
    course: TCourse;
    studentRollNo: string;
  };
  RefundPayment: {
    course: TCourse;
    studentRollNo: string;
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
  EmployeeList: undefined;
  EmployeeDetails: {
    employeeId: string;
  };
  EmployeeSalaryDetails: {
    employeeId: string;
  };

  TeachersList: undefined;
  TeacherDetails: {
    teacherId: string;
  };
  TeacherProfileDetails: {
    teacherId: string;
  };

  // Attendance Module

  EmployeeAttendance: undefined;
  EmployeeSelfAttendance: undefined;
  StudentBatchList: undefined;
  StudentAttendance: {
    batchId: string;
  };
  Reports: undefined;
  Timetable: undefined;

  // lead management
  FormsAssignManager: {
    leads?: TFormEnquiry[];
    formTemplateId: string;
  };
  FormEnquiryDetails: {
    formTemplateId: string;
    formId: string;
  };

  // Upload Data

  UploadFormList: undefined;
  UploadFormListEnquiries: {
    formTemplateId: string;
  };
  BulkDataList: {
    formTemplateId: string;
  };
  BulkDataFormDetails: {
    formTemplateId: string;
    formId: string;
  };
  StudentAdmission: undefined;
  AddEmployeeScreen: undefined;
  HighestQualification: {
    employeeData?: any;
  };
  EducationDetails: {
    employeeData?: any;
    highestQualificationData?: any;
  };
  MonthlySalary: {
    employeeData?: any;
    highestQualificationData?: any;
    educationDetailsData?: any;
  };
  BankDetails: {
    employeeData?: any;
    highestQualificationData?: any;
    educationDetailsData?: any;
    monthlySalaryData?: any;
  };
  ReviewPage: {
    employeeData?: any;
    highestQualificationData?: any;
    educationDetailsData?: any;
    monthlySalaryData?: any;
    bankDetailsData?: any;
  };
};


