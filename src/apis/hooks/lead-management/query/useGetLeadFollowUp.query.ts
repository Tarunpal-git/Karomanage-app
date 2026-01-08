// import { useQuery } from "@tanstack/react-query";
// import { request } from "../../../../services/axios.service";
// import { LEAD_MANAGEMENT_PREFIX } from "../../../../constants";

// type TParams = {
//   leadId: string;
// };

// const getLeadFollowUp = async (params: TParams) => {
//   const response = await request({
//     url: LEAD_MANAGEMENT_PREFIX + "getLeadFollowUp",
//     method: "GET",
//     params: {
//       leadId: params.leadId,
//     },
//   });
//   return response;
// };

// export const useGetLeadFollowUpQuery = (params: TParams) => {
//   return useQuery({
//     queryKey: ["getLeadFollowUp", params.leadId],
//     queryFn: () => getLeadFollowUp(params),
//   });
// };

import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { LEAD_MANAGEMENT_PREFIX } from "../../../../constants";

// 🔹 Updated params type
type TParams = {
  leadId: string;
  customerId: string;
  organizationId: string;
  leadSourceType: string;
};

// 🔹 API function
const getLeadFollowUp = async (params: TParams) => {
  const response = await request({
    url: LEAD_MANAGEMENT_PREFIX + "getLeadFollowUp",
    method: "GET",
    params: {
      leadId: params.leadId,
      customerId: params.customerId,
      organizationId: params.organizationId,
      leadSourceType: params.leadSourceType, // ✅ missing param added
    },
  });

  return response;
};

// 🔹 React Query hook
export const useGetLeadFollowUpQuery = (params: TParams) => {
  return useQuery({
    queryKey: [
      "getLeadFollowUp",
      params.leadId,
      params.customerId,
      params.organizationId,
      params.leadSourceType,
    ],
    queryFn: () => getLeadFollowUp(params),

    // ✅ jab tak saare params na ho, API call nahi hogi
    enabled:
      !!params.leadId &&
      !!params.customerId &&
      !!params.organizationId &&
      !!params.leadSourceType,
  });
};
