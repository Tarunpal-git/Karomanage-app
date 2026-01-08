import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async (templateId: string) => {
  const response = await request({
    url: apiUrls.enquiry.FETCH_FORM_TEMPLATE_DETAILS,
    method: "GET",
    params: {
      formTemplateId: templateId,
    },
  });
  return response;
};

export const useFormTemplateDetailsQuery = (templateId: string) => {
  return useQuery({
    queryKey: [apiUrls.enquiry.FETCH_FORM_TEMPLATE_DETAILS, templateId],
    queryFn: () => get(templateId),
  });
};
