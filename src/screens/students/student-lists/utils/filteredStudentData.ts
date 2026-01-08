export const filteredStudentData = (
  data: TStudentList[],
  filters: {
    search: string;
    studentStatus: string;
    paymentStatus: string;
    courseName: string;
    batchName: string;
  }
) => {
  const { search } = filters;

  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter((student) => {
    const matchesSearch =
      !search ||
      student.studentFirstName.toLowerCase().includes(search.toLowerCase()) ||
      student.studentLastName.toLowerCase().includes(search.toLowerCase()) ||
      student.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      student.studentContact.includes(search);

    return matchesSearch;
  });
};
