import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IGetParams {
  batchId: string;
  attendanceId: string;
}

const get = async (params: IGetParams) => {
  const response = await request({
    url: apiUrls.attendance.FETCH_SINGLE_ATTENDANCE,
    method: "GET",
    params: params,
  });
  return response;
};

export const useSingleAttendanceQuery = (params: IGetParams) => {
  return useQuery({
    queryKey: [apiUrls.attendance.FETCH_SINGLE_ATTENDANCE, params],
    queryFn: () => get(params),
  });
};
