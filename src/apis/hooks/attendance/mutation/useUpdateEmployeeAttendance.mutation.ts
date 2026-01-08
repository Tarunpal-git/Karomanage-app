import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";
import { TUnmarkedEmployeeAttendance } from "../../../../screens/attendance/employe-attendance/utils/generateUnmarkedEmployeeData";

type TData = {
  attendanceId: string;
  employees: Omit<TUnmarkedEmployeeAttendance, "name" | "designation">[];
};

const updateAttendance = async (data: TData) => {
  const user = store.getState().auth.authUser;
  const selectedOrganization = store.getState().auth.selectedOrganization;

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

  const response = await request({
    url: apiUrls.attendance.UPDATE_EMPLOYEE_ATTENDANCE,
    method: "POST",
    data: updateData,
  });

  return response;
};

export const useUpdateEmployeeAttendanceMutation = () => {
  return useMutation({ mutationFn: updateAttendance });
};
