import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TData = {
  batchId: string;
  attendanceId: string;
  students: {
    studentId: string;
    attendanceStatus: string;
  }[];
};

const markAttendance = async (data: TData) => {
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
  console.log("daupdateDatata", updateData);
  const response = await request({
    url: apiUrls.attendance.CREATE_STUDENT_ATTENDANCE,
    method: "POST",
    data: updateData,
  });

  return response;
};

export const useMarkStudentAttendanceMutation = () => {
  return useMutation({ mutationFn: markAttendance });
};
