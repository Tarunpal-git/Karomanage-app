import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

type TGetStatusParams = {
  flag: "csv" | "global" | "enquiry" | "form";
  formTemplateId?: string;
  formBulkDataId?: string;
};

const get = async (params: TGetStatusParams) => {
  const response = await request({
    url: apiUrls.enquiry.GET_STATUS,
    method: "GET",
    params: {
      flag: params.flag,
      ...(params.formTemplateId && { formTemplateId: params.formTemplateId }),
      ...(params.formBulkDataId && { formBulkDataId: params.formBulkDataId }),
    },
  });
  return response;
};

export const useGetStatusQuery = (params: TGetStatusParams) => {
  return useQuery({
    queryKey: ["getStatus", params],
    queryFn: () => get(params),
    enabled: !!params.flag,
  });
}; 