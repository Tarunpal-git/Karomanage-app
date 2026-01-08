import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.enquiry.FETCH_FORMS_TEMPLATE_LIST,
    method: "GET",
  });
  return response;
};

export const useFetchFormsTemplateListQuery = () => {
  return useQuery({
    queryKey: [apiUrls.enquiry.FETCH_FORMS_TEMPLATE_LIST],
    queryFn: get,
  });
};
