export const filteredTeachersList = (
  data: TTeacherData[],
  filters: {
    search: string;
  }
) => {
  const { search } = filters;

  return data.filter((teacher) => {
    const matchesSearch =
      !search ||
      `${teacher.teacherFirstName} ${teacher.teacherLastName ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesSearch;
  });
};
