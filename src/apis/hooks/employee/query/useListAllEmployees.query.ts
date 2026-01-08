import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.employees.LIST_ALL_EMPLOYEES,
    method: "GET",
  });
  return response;
};

export const useListAllEmployeesQuery = () => {
  return useQuery({
    queryKey: [apiUrls.employees.LIST_ALL_EMPLOYEES],
    queryFn: get,
  });
};