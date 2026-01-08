import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IQueryParams {
  startDate: string;
  endDate: string;
}

const get = async (params: IQueryParams) => {
  const response = await request({
    url: apiUrls.dashboard.FETCH_UPCOMING_FORECAST_PAYMENT,
    method: "GET",
    params: params,
  });
  return response;
};

export const useUpcomingPaymentForecastQuery = (params: IQueryParams) => {
  return useQuery({
    queryKey: [apiUrls.dashboard.FETCH_UPCOMING_FORECAST_PAYMENT, params],
    queryFn: () => get(params),
  });
};
