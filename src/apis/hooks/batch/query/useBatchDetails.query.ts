import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

interface IData {
  batchId: string;
}

const get = async (data: IData) => {
  const organization = store.getState().auth.selectedOrganization;

  const response = await request({
    url: apiUrls.batch.FETCH_BATCH_DETAILS,
    method: "POST",
    data: {
      batchId: data.batchId,
      customerId: organization?.customerId,
      organizationId: organization?.organizationId,
    },
  });
  return response;
};

export const useBatchDetailsQuery = (data: IData) => {
  return useQuery({
    queryKey: [apiUrls.batch.FETCH_BATCH_DETAILS, data],
    queryFn: () => get(data),
  });
};
