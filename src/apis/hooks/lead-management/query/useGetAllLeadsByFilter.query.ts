import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { LEAD_MANAGEMENT_PREFIX } from "../../../../constants";

const getAllLeadsByFilter = async (formTemplateId: string) => {
  const response = await request({
    url: LEAD_MANAGEMENT_PREFIX + "getAllLeadsByFilter",
    method: "GET",
    params: {
      formTemplateId: formTemplateId,
    },
  });
  return response;
};

export const useGetAllLeadsByFilterQuery = (formTemplateId: string) => {
  return useQuery({
    queryKey: ["getAllLeadsByFilter", formTemplateId],
    queryFn: () => getAllLeadsByFilter(formTemplateId),
  });
};

