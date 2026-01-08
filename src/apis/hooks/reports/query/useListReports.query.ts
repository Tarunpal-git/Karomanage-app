import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async (action: string) => {
  const response = await request({
    url: apiUrls.reports.FETCH_REPORT_LIST,
    method: "GET",
    params: {
      action: action,
    },
  });
  return response;
};

export const useListReportsQuery = (action: string) => {
  return useQuery({
    queryKey: [apiUrls.reports.FETCH_REPORT_LIST, action],
    queryFn: () => get(action),
  });
};
