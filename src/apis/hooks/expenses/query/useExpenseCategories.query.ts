import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { ORGANIZATION_PREFIX } from "../../../../constants";

const get = async () => {
  const response = await request({
    url: apiUrls.expenses.FETCH_EXPENSES_CATEGORY,
    method: "GET",
  });
  return response;
};

export const useExpenseCategoriesQuery = () => {
  return useQuery({
    queryKey: [ORGANIZATION_PREFIX, apiUrls.expenses.FETCH_EXPENSES_CATEGORY],
    queryFn: get,
  });
};
