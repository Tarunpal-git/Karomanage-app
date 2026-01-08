import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.uploadedForms.FETCH_FORM_TEMPLATE,
    method: "GET",
  });
  return response;
};

export const useUploadedFormTemplatesQuery = () => {
  return useQuery({
    queryKey: [apiUrls.uploadedForms.FETCH_FORM_TEMPLATE],
    queryFn: get,
  });
};
