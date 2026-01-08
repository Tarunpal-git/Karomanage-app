// import { useQuery } from "@tanstack/react-query";
// import { request } from "../../../../services/axios.service";
// import { apiUrls } from "../../../urls";

// interface IGetSingleSalaryParams {
//   employeeId: string;
//   month?: string;  // Optional - agar month chahiye
//   year?: string;   // Optional - agar year chahiye
//   // Ya koi aur parameters jo API expect karti ho
// }

// const get = async (params: IGetSingleSalaryParams) => {
//   const response = await request({
//     url: apiUrls.employees.SINGLE_SALARY,
//     method: "GET",
//     params: params,
//   });
//   console.log("Single Salary Response:", response);
//   return response;
// };

// export const useSingleSalaryQuery = (params: IGetSingleSalaryParams) => {
//   return useQuery({
//     queryKey: [apiUrls.employees.SINGLE_SALARY, params],
//     queryFn: () => get(params),
//     enabled: !!params.employeeId, // Only fetch if employeeId exists
//   });
// };


import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

interface IGetSingleSalaryParams {
  employeeId: string;
  month: string;  // Required
  year: string;    // Required
}

const get = async (params: IGetSingleSalaryParams, customerId: string, organizationId: string) => {
  const response = await request({
    url: apiUrls.employees.SINGLE_SALARY,
    method: "GET",
    params: {
      customerId,
      organizationId,
      employeeId: params.employeeId,
      month: params.month,
      year: params.year,
    },
  });
  console.log("Single Salary Response:", response);
  return response;
};

export const useSingleSalaryQuery = (params: IGetSingleSalaryParams) => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  
  return useQuery({
    queryKey: [apiUrls.employees.SINGLE_SALARY, params, selectedOrganization?.customerId, selectedOrganization?.organizationId],
    queryFn: () => get(params, selectedOrganization?.customerId || "", selectedOrganization?.organizationId || ""),
    enabled: !!params.employeeId && !!params.month && !!params.year && !!selectedOrganization?.customerId && !!selectedOrganization?.organizationId,
  });
};