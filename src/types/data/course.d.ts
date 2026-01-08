type TCourseStudent = {
  rollNo: string;
  studentStatus: string;
};

type TCourseBatch = {
  batchId: string;
  batchStatus: string;
  students: TCourseStudent[];
};

type TCourseData = {
  customerId: string;
  organizationId: string;
  batch: TCourseBatch[];
  teacher: any[];
  courseName: string;
  courseDescription: string;
  courseFee: number;
  courseFeeDescription: string;
  maxPaymentInstallment: number;
  courseDuration: number;
  courseId: string;
  courseStatus: string;
  dateCreated: number;
  lastUpdatedDate: number;
};
