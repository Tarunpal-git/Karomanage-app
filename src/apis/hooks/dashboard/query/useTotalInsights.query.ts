import { useQueries } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const fetchTotalExpenses = async () => {
  const response = await request({
    url: apiUrls.dashboard.FETCH_TOTAL_EXPENSES,
    method: "GET",
  });
  return response;
};

const fetchTotalPayment = async () => {
  const response = await request({
    url: apiUrls.dashboard.TOTAL_RECEIVED_AND_UPCOMING_AMOUNT,
    method: "GET",
  });
  return response;
};

export const useTotalInsightsQuery = () => {
  return useQueries({
    queries: [
      {
        queryKey: [apiUrls.dashboard.FETCH_TOTAL_EXPENSES],
        queryFn: fetchTotalExpenses,
        select: (res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = res as any;
          const totalExpenses =
            data?.data?.length > 0 && data?.data?.[0].totalExpense;
          return totalExpenses ?? 0;
        },
      },
      {
        queryKey: [apiUrls.dashboard.TOTAL_RECEIVED_AND_UPCOMING_AMOUNT],
        queryFn: fetchTotalPayment,
        select: (res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = res as any;

          return {
            totalReceivedAmount: data?.data?.totalReceivedAmount ?? 0,
          };
        },
      },
    ],
  });
};
