export const filteredCourseLists = (
  data: TCourseData[],
  filters: {
    search: string;
  }
) => {
  const { search } = filters;

  return data.filter((course) => {
    const matchesSearch =
      !search || course.courseName.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });
};
