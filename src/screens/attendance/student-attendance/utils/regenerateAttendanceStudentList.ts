export interface TFilteredAttendanceStudent {
  enrollmentNo: string;
  name: string;
  mobileNumber: string;
  attendanceStatus: TAttendanceStudent["attendanceStatus"];
  rollNo: string;
  studentId: string;
}

export const regenerateAttendanceStudentList = (
  attendanceStudents: TAttendanceStudent[],
  allStudentsList: TStudentList[]
) => {
  const studentsRollNumbers = new Set(
    attendanceStudents.map((ce) => ce.studentId)
  );

  const filteredStudents = allStudentsList.filter((student) =>
    studentsRollNumbers.has(student.rollNo)
  );

  return filteredStudents.map((student) => {
    const attendanceStatus = attendanceStudents.find(
      (attStudent) => attStudent.studentId === student.rollNo
    )?.attendanceStatus;

    return {
      name: student.studentFirstName + " " + student.studentLastName,
      studentId: student.rollNo,
      enrollmentNo: student.studentEnrollmentNumber,
      attendanceStatus: attendanceStatus ?? "absent",
      mobileNumber: student.studentContact,
      rollNo: student.rollNo,
    };
  });
};
