import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.dashboard.FETCH_STUDENT_RECEIVED_PAYMENT,
    method: "GET",
  });
  return response;
};

export const useDashboardReceivedPaymentQuery = () => {
  return useQuery({
    queryKey: [apiUrls.dashboard.FETCH_STUDENT_RECEIVED_PAYMENT],
    queryFn: get,
  });
};
