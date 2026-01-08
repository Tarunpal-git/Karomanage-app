import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IGetParams {
  attendanceId: string;
}

const get = async (params: IGetParams) => {
  const response = await request({
    url: apiUrls.attendance.FETCH_SINGLE_EMPLOYEE_ATTENDANCE,
    method: "GET",
    params: params,
  });
  console.log("responseetet", response);
  return response;
};

export const useSingleEmployeeAttendanceQuery = (params: IGetParams) => {
  return useQuery({
    queryKey: [apiUrls.attendance.FETCH_SINGLE_EMPLOYEE_ATTENDANCE, params],
    queryFn: () => get(params),
  });
};
