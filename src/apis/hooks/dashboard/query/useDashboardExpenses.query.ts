import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.dashboard.FETCH_EXPENSES_DATA,
    method: "GET",
  });
  return response;
};

export const useDashboardExpensesQuery = () => {
  return useQuery({
    queryKey: [apiUrls.dashboard.FETCH_EXPENSES_DATA],
    queryFn: get,
  });
};
