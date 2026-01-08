import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

const get = async (id: string) => {
  const response = await request({
    url: apiUrls.enquiry.FETCH_ENQUIRY_DETAILS,
    method: "GET",
    params: {
      id: id,
    },
  });
  return response;
};

export const useEnquiryDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: [apiUrls.enquiry.FETCH_ENQUIRY_DETAILS, id],
    queryFn: () => get(id),
  });
};
