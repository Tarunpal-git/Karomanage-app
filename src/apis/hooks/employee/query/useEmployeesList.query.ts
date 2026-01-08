import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.employees.FETCH_EMPLOYEES_LIST,
    method: "GET",
  });
  return response;
};

export const useEmployeesListQuery = () => {
  return useQuery({
    queryKey: [apiUrls.employees.FETCH_EMPLOYEES_LIST],
    queryFn: get,
  });
};
