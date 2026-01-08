type TTeacherData = {
  customerId: string;
  organizationId: string;
  teacherId: string;
  teacherFirstName: string;
  teacherLastName: string;
  dateOfBirth: string;
  teacherEmail: string;
  teacherPhoneNumber: string;
  teacherStatus: "active" | "inActive";
  courses: TTeacherCourses[];
  batch: TTeacherBatches[];
  dateCreated: number;
  lastUpdatedDate: number;
  id: string;
};

type TTeacherBatches = {
  batchId: string;
};
type TTeacherCourses = {
  courseId: string;
};
