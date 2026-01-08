import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IParams {
  formTemplateId: string;
}

const get = async (params: IParams) => {
  const response = await request({
    url: apiUrls.uploadedForms.FETCH_BULK_DATA,
    method: "GET",
    params: {
      ...params,
      pageIndex: 0,
    },
  });
  return response;
};

export const useFetchBulkDataQuery = (params: IParams) => {
  return useQuery({
    queryKey: [apiUrls.uploadedForms.FETCH_BULK_DATA, params],
    queryFn: () => get(params),
  });
};