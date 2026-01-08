import { useQueries } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const fetchTotalStudents = async () => {
  const response = await request({
    url: apiUrls.dashboard.FETCH_STUDENTS_COUNT,
    method: "GET",
  });
  return response;
};

const fetchTotalEmployee = async () => {
  const response = await request({
    url: apiUrls.dashboard.FETCH_EMPLOYEE_COUNT,
    method: "GET",
  });
  return response;
};

const fetchTotalPayment = async () => {
  try {
  const response = await request({
    url: apiUrls.dashboard.TOTAL_RECEIVED_AND_UPCOMING_AMOUNT,
    method: "GET",
  });
  console.log("API Response:", response);
  return response;
} catch (error) {
  console.error("API Error:", error);
  throw error;
}
};

export const useDashboardQuery = () => {
  return useQueries({
    queries: [
      {
        queryKey: [apiUrls.dashboard.FETCH_STUDENTS_COUNT],
        queryFn: fetchTotalStudents,
        select: (res) => {
          const data = res as any;
          const totalStudentsCount =
            data?.data?.totalStudents?.studentDataCount;
          return totalStudentsCount ?? 0;
        },
      },
      {
        queryKey: [apiUrls.dashboard.FETCH_EMPLOYEE_COUNT],
        queryFn: fetchTotalEmployee,
        select: (res) => {
          const data = res as any;
          const totalEmployeeCount =
            data?.data?.totalEmployees?.employeeDataCount;
          return totalEmployeeCount ?? 0;
        },
      },
      {
        queryKey: [apiUrls.dashboard.TOTAL_RECEIVED_AND_UPCOMING_AMOUNT],
        queryFn: fetchTotalPayment,
        select: (res) => {
          const data = res as any;

          return {
            totalReceivedAmount: data?.data?.totalReceivedAmount ?? 0,
            totalUpcomingAmount: data?.data?.totalUpcomingAmount ?? 0,
          };
        
          
        },
      },
    ],
  });
};
