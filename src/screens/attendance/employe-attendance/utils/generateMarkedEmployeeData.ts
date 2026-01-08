export type TMarkedEmployeeAttendanceData = {
  name: string;
  designation: string;
  dateOfBirth: string;
  email: string;
  employeeId: string;
  attendanceStatus: string;
  availablityStatus: {
    status: string;
    interval: string;
  };
  totalHours: string;
};

export const generateMarkedEmployeeData = (
  employeesList: TEmployeeData[],
  attendanceEmployees: TAttendanceEmployee[]
) => {
  const employeeIds = new Set(attendanceEmployees.map((ce) => ce.employeeId));

  const filteredEmployees = employeesList.filter((employee) =>
    employeeIds.has(employee.employeeId)
  );

  return filteredEmployees.map((employee) => {
    const attendance = attendanceEmployees.find(
      (attEmployee) => attEmployee.employeeId === employee.employeeId
    );

    return {
      name: `${employee.employeePersonalDetails.employeeFirstname} ${
        employee.employeePersonalDetails.employeeLastname ?? " "
      }`,
      designation:
        employee?.employeePersonalDetails?.employeeDesignation ?? "-",
      dateOfBirth:
        employee?.employeePersonalDetails?.employeeDateOfBirth ?? "-",
      email: employee?.employeePersonalDetails?.employeeEmail ?? "-",
      employeeId: employee.employeeId,
      attendanceStatus: attendance?.attendanceStatus ?? "absent",
      availablityStatus: attendance?.availablityStatus ?? {
        interval: "-",
        status: "-",
      },
      totalHours: attendance?.totalHours ?? "-",
    };
  });
};
