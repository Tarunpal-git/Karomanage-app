import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { COLLEGE_URLS } from "../../urls/college.urls";

const getStatesCities = async () => {
  const response = await request({
    url: COLLEGE_URLS.GET_COLLEGE_LIST,
    method: "GET",
    // Call without state/city params to get all colleges data
    // This will return all states and cities from all colleges
  });
  return response;
};

export const useGetStatesCitiesQuery = () => {
  return useQuery({
    queryKey: [COLLEGE_URLS.GET_COLLEGE_LIST, 'states-cities'],
    queryFn: getStatesCities,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 