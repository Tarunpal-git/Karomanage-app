interface TAttendanceStudent {
  studentId: string;
  attendanceStatus: "present" | "absent" | "late" | "onLeave";
}

interface TSingleAttendance {
  customerId: string;
  organizationId: string;
  batchId: string;
  attendanceId: string;
  attendanceDate: string;
  dateCreated: number;
  lastModified: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  students: TAttendanceStudent[];
}

type TAttendanceEmployee = {
  employeeId: string;
  attendanceStatus: string;
  availablityStatus: {
    status: string;
    interval: string;
  };
  totalHours: string;
};

interface TSingleEmployeeAttendance {
  customerId: string;
  organizationId: string;
  batchId: string;
  attendanceId: string;
  attendanceDate: string;
  dateCreated: number;
  lastModified: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  employees: TAttendanceEmployee[];
}
