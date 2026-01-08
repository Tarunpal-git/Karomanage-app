import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IGetMonthlyAttendanceParams {
  employeeId: string;
  month?: string; // Optional - agar month filter chahiye
  year?: string; // Optional - agar year filter chahiye
}

const get = async (params: IGetMonthlyAttendanceParams) => {
  const response = await request({
    url: apiUrls.attendance.FETCH_SINGLE_EMPLOYEE_MONTHLY_ATTENDANCE,
    method: "GET",
    params: params,
  });
  console.log("Single Employee Monthly Attendance Response:", response);
  return response;
};

export const useSingleEmployeeMonthlyAttendanceQuery = (params: IGetMonthlyAttendanceParams) => {
  return useQuery({
    queryKey: [apiUrls.attendance.FETCH_SINGLE_EMPLOYEE_MONTHLY_ATTENDANCE, params],
    queryFn: () => get(params),
    enabled: !!params.employeeId, // Only fetch if employeeId exists
  });
};