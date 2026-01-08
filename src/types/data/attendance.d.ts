type TAttendanceStatus = "present" | "absent";

type TAttendanceHistory = {
  attendanceId: string;
  attendanceDate: string;
  attendanceStatus: TAttendanceStatus;
};

type TStudentAttendanceData = {
  customerId: string;
  organizationId: string;
  batchId: string;
  dateCreated: number;
  lastModified: number;
  attendanceHistory: TAttendanceHistory[];
};
