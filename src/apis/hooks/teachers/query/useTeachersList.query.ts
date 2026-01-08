import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.teacher.FETCH_TEACHERS_LIST,
    method: "GET",
  });
  return response;
};

export const useTeachersListQuery = () => {
  return useQuery({
    queryKey: [apiUrls.teacher.FETCH_TEACHERS_LIST],
    queryFn: get,
  });
};
