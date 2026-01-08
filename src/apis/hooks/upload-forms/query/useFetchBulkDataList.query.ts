import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

interface IParams {
  formTemplateId: string;
  customerId: string;
  organizationId: string;
  flag: string;
  lengthOfData: number;
  dataIndex: number;
  pageIndex: number;

}

const get = async (params: IParams) => {
  try {
    const response = await request({
      url: apiUrls.uploadedForms.FETCH_BULK_DATA_LIST,
      method: "GET",
      params: {
        ...params,
        pageIndex: 0,
      },
    });
    console.log("API Response:", response.data.metaFields);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const useFetchBulkDataListQuery = (params: IParams) => {
  return useQuery({
    queryKey: [apiUrls.uploadedForms.FETCH_BULK_DATA_LIST, params],
    queryFn: () => get(params),
  });
};
