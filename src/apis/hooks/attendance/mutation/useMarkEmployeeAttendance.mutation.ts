import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";
import { TUnmarkedEmployeeAttendance } from "../../../../screens/attendance/employe-attendance/utils/generateUnmarkedEmployeeData";
import { checkValuesBeforeApiCall } from "../../../../utils/debugOrganization";

type TData = {
  attendanceId: string;
  employees: Omit<TUnmarkedEmployeeAttendance, "name" | "designation">[];
};

const markAttendance = async (data: TData) => {
  // Debug check before API call
  const debugInfo = checkValuesBeforeApiCall("MARK_EMPLOYEE_ATTENDANCE");
  
  const user = store.getState().auth.authUser;
  const selectedOrganization = store.getState().auth.selectedOrganization;
  
  console.log("👥 === MARK EMPLOYEE ATTENDANCE DEBUG ===");
  console.log("User:", user);
  console.log("Selected Organization:", selectedOrganization);
  console.log("Attendance Data:", data);
  
  const updateData = {
    ...data,
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.userType,
    },
    customerId: selectedOrganization?.customerId,
    organizationId: selectedOrganization?.organizationId,
  };
  
  console.log("Final updateData:", updateData);
  console.log("👥 === END MARK EMPLOYEE ATTENDANCE DEBUG ===");
  
  const response = await request({
    url: apiUrls.attendance.CREATE_EMPLOYEE_ATTENDANCE,
    method: "POST",
    data: updateData,
  });

  return response;
};

export const useMarkEmployeeAttendanceMutation = () => {
  return useMutation({ mutationFn: markAttendance });
};
