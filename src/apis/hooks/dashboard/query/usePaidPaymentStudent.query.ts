import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IQueryParams {
  startDate: string;
  endDate: string;
}

const get = async (params: IQueryParams) => {
  const response = await request({
    url: apiUrls.dashboard.FETCH_PAID_STUDENT_PAYMENT_LIST,
    method: "GET",
    params: params,
  });
  return response;
};

export const usePaidPaymentStudentQuery = (params: IQueryParams) => {
  return useQuery({
    queryKey: [apiUrls.dashboard.FETCH_PAID_STUDENT_PAYMENT_LIST, params],
    queryFn: () => get(params),
  });
};
