import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IQueryParams {
  startDate: string;
  endDate: string;
}

const get = async (params: IQueryParams) => {
  const response = await request({
    url: apiUrls.dashboard.FETCH_OVERDUE_STUDENT_PAYMENT_LIST,
    method: "GET",
    params: params,
  });
  console.log("=== OVERDUE STUDENT PAYMENT API RESPONSE ===");
  console.log("Overdue Student Payment API Response:", JSON.stringify(response, null, 2));
  console.log("=== END OVERDUE STUDENT PAYMENT API RESPONSE ===");
  return response;
};

export const useOverduePaymentStudentQuery = (params: IQueryParams) => {
  return useQuery({
    queryKey: [apiUrls.dashboard.FETCH_OVERDUE_STUDENT_PAYMENT_LIST, params],
    queryFn: () => get(params),
  });
};
