import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.dashboard.FETCH_OVERDUE_PAYMENT,
    method: "GET",
  });
  console.log("=== OVERDUE PAYMENT API RESPONSE ===");
  console.log("Overdue Payment API Response:", JSON.stringify(response, null, 2));
  console.log("=== END OVERDUE PAYMENT API RESPONSE ===");
  return response;
};

export const useDashboardOverduePaymentQuery = () => {
  return useQuery({
    queryKey: [apiUrls.dashboard.FETCH_OVERDUE_PAYMENT],
    queryFn: get,
  });
};
