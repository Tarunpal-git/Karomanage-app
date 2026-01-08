import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { COLLEGE_URLS } from "../../urls/college.urls";

interface CollegeListParams {
  state?: string;
  city?: string;
}

const get = async (params?: CollegeListParams) => {
  const response = await request({
    url: COLLEGE_URLS.GET_COLLEGE_LIST,
    method: "GET",
    params,
  });
  return response;
};

export const useCollegeListQuery = (params?: CollegeListParams) => {
  return useQuery({
    queryKey: [COLLEGE_URLS.GET_COLLEGE_LIST, params],
    queryFn: () => get(params),
    enabled: !!params?.state && !!params?.city,
  });
}; 