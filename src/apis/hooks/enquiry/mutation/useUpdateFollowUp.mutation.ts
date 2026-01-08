import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

type TData = {
  id: string;
  followUpDate: string;
  description: string;
  followUpId: string;
  message: string;
};

const update = async (data: TData) => {
  const response = await request({
    url: apiUrls.enquiry.UPDATE_FOLLOW_UP,
    method: "POST",
    data: data,
  });
  return response;
};

export const useUpdateFollowUpMutation = () => {
  return useMutation({ mutationFn: update });
};
