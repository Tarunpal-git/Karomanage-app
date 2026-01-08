import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async (rollNo: string) => {
  const response = await request({
    url: apiUrls.student.FETCH_STUDENT_DETAILS,
    method: "GET",
    params: {
      rollNo: rollNo,
    },
  });
  return response;
};

export const useStudentDetailsQuery = (rollNo: string) => {
  return useQuery({
    queryKey: [apiUrls.student.FETCH_STUDENT_DETAILS, rollNo],
    queryFn: () => get(rollNo),
  });
};
