import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

type TParams = {
  formTemplateId: string;
  formId: string;
};

const get = async (params: TParams) => {
  const response = await request({
    url: apiUrls.enquiry.FETCH_FORM_ENQUIRY_DETAILS,
    method: "GET",
    params: params,
  });
  return response;
};

export const useFetchFormEnquiryDetailsQuery = (params: TParams) => {
  return useQuery({
    queryKey: [apiUrls.enquiry.FETCH_FORM_ENQUIRY_DETAILS, params],
    queryFn: () => get(params),
  });
};
