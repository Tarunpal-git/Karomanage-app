import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async (employeeId: string) => {
  const response = await request({
    url: apiUrls.employees.FETCH_EMPLOYEE_DETAILS,
    method: "GET",
    params: {
      employeeId,
    },
  });
  return response;
};

export const useEmployeeDetailsQuery = (employeeId: string) => {
  return useQuery({
    queryKey: [apiUrls.employees.FETCH_EMPLOYEE_DETAILS, employeeId],
    queryFn: () => get(employeeId),
  });
};
