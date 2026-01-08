import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IParams {
  formTemplateId: string;
  formId: string;
}

const get = async (params: IParams) => {
  const response = await request({
    url: apiUrls.uploadedForms.FETCH_BULK_FORM_DETAILS,
    method: "GET",
    params: {
      ...params,
      pageIndex: 0,
    },
  });
  return response;
};

export const useFetchSingleBulkFormDataQuery = (params: IParams) => {
  return useQuery({
    queryKey: [apiUrls.uploadedForms.FETCH_BULK_FORM_DETAILS, params],
    queryFn: () => get(params),
  });
};
