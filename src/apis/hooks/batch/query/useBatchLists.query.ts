import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async () => {
  const response = await request({
    url: apiUrls.batch.FETCH_BATCHES_LIST,
    method: "GET",
    // Unified endpoint: /organizationDetails*/batchAndCourseV2?type=batch
    params: {
      type: "batch",
    },
  });
  return response;
};

export const useBatchListsQuery = () => {
  return useQuery({
    queryKey: [apiUrls.batch.FETCH_BATCHES_LIST],
    queryFn: get,
  });
};
