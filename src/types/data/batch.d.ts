interface TBatchCourse {
  courseId: string;
  courseStatus: string;
}

interface TBatchStudent {
  rollNo: string;
  studentStatus: string;
}

interface TBatchData {
  customerId: string;
  organizationId: string;
  courses: TBatchCourse[];
  students: TBatchStudent[];
  teacher: any[]; // Adjust the type as needed
  batchName: string;
  batchDescription: string;
  batchClassStartTime: string;
  batchClassEndTime: string;
  batchStartDate: string;
  batchEndDate: string;
  batchMode: string;
  batchId: string;
  dateCreated: number;
  lastUpdatedDate: number;
  batchStatus: string;
}
