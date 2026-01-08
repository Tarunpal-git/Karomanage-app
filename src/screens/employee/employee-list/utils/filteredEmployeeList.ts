export const filteredEmployeeList = (
  data: TEmployeeData[],
  filters: {
    search: string;
  }
) => {
  const { search } = filters;

  return data.filter((employee) => {
    const matchesSearch =
      !search ||
      `${employee.employeePersonalDetails.employeeFirstname} ${employee.employeePersonalDetails.employeeLastname}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesSearch;
  });
};
