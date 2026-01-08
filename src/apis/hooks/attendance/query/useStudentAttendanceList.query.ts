import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IGetParams {
  batchId: string;
  studentId: string;
}

const get = async (params: IGetParams) => {
  const response = await request({
    url: apiUrls.attendance.FETCH_STUDENT_ATTENDANCE_LIST,
    method: "GET",
    params: params,
  });
  return response;
};

export const useStudentAttendanceListQuery = (params: IGetParams) => {
  return useQuery({
    queryKey: [apiUrls.attendance.FETCH_STUDENT_ATTENDANCE_LIST, params],
    queryFn: () => get(params),
  });
};
