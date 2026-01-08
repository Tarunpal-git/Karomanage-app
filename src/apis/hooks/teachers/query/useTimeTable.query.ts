import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async (params: {
  customerId: string;
  organizationId: string;
  batchId: string;
  startWeekDate: string;
  endWeekDate: string;
}) => {
  const response = await request({
    url: apiUrls.timetable.FETCH_TIME_TABLE,
    method: "GET",
    params: {
      customerId: params.customerId,
      organizationId: params.organizationId,
      batchId: params.batchId,
      startWeekDate: params.startWeekDate,
      endWeekDate: params.endWeekDate,
    },
  });

  return response;
};

export const useTimeTableQuery = (params: {
  customerId: string;
  organizationId: string;
  batchId: string;
  startWeekDate: string;
  endWeekDate: string;
}) => {
  return useQuery({
    queryKey: ["timeTable", params],
    queryFn: () => get(params),
    enabled: !!params.batchId,
  });
};

