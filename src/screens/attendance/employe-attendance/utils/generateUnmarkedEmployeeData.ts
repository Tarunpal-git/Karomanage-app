export type TUnmarkedEmployeeAttendance = {
  employeeId: string;
  attendanceStatus: string;
  availablityStatus: {
    status: string;
    interval: string;
  };
  totalHours: string;
  name: string;
  designation: string;
};

export const generateUnmarkedEmployeeData = (employeeList: TEmployeeData[]) => {
  return employeeList.map((employee) => ({
    employeeId: employee.employeeId,
    attendanceStatus: "absent",
    availablityStatus: {
      status: "FullDay",
      interval: "",
    },
    totalHours: "-",
    name: `${employee?.employeePersonalDetails?.employeeFirstname} ${
      employee?.employeePersonalDetails?.employeeLastname ?? " "
    }`,

    designation: employee?.employeePersonalDetails?.employeeDesignation,
  }));
};
