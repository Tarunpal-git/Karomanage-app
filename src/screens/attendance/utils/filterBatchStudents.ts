export type TFilterUnmarkedStudents = {
  name: string;
  studentId: string;
  enrollmentNo: string;
  attendanceStatus: string;
};

export const filterBatchStudents = (
  batchStudents: TBatchStudent[],
  studentsList: TStudentList[]
) => {
  const studentsRollNumbers = new Set(batchStudents.map((ce) => ce.rollNo));

  const filteredData = studentsList.filter((student) =>
    studentsRollNumbers.has(student.rollNo)
  );

  return filteredData.map((student) => ({
    name: student.studentFirstName + " " + student.studentLastName,
    studentId: student.rollNo,
    enrollmentNo: student.studentEnrollmentNumber,
    attendanceStatus: "absent",
  }));
};
