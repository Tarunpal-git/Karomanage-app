import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async (templateId: string) => {
  const response = await request({
    url: apiUrls.enquiry.FETCH_FORM_ENQUIRIES,
    method: "GET",
    params: {
      formTemplateId: templateId,
    },
  });
  return response;
};

export const useFormEnquiriesQuery = (templateId: string) => {
  return useQuery({
    queryKey: [apiUrls.enquiry.FETCH_FORM_ENQUIRIES, templateId],
    queryFn: () => get(templateId),
  });
};
