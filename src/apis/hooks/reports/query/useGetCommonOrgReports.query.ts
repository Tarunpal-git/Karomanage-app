import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import moment from "moment";

const get = async (action: string, date: string) => {
  const data: {
    year: string;
    month?: string;
    date?: string;
  } = {
    year: moment(date).format("YYYY"),
  };

  if (action === "yearly") {
    data.year = moment(date).format("YYYY");
  }

  if (
    action === "halfYearly" ||
    action === "quarterly" ||
    action === "monthly"
  ) {
    data.year = moment(date).format("YYYY");
    data.month = moment(date).format("MM");
  }

  if (action === "weekly") {
    data.year = moment(date).format("YYYY");
    data.month = moment(date).format("MM");
    data.date = moment(date).format("DD");
  }

  const response = await request({
    url: apiUrls.reports.FETCH_COMMON_ORG_REPORTS,
    method: "GET",
    params: {
      action: action,
      ...data,
    },
  });
  return response;
};

export const useGetCommonOrgReportsQuery = (
  action: string,
  date: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: [apiUrls.reports.FETCH_COMMON_ORG_REPORTS, action, date],
    queryFn: () => get(action, date),
    enabled: enabled,
  });
};
