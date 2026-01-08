import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";

type TData = {
  details: TBulkDataEnquiry;
};

const update = async (data: TData) => {
  const response = await request({
    url: apiUrls.uploadedForms.UPDATE_SINGLE_BULK_FORM,
    method: "POST",
    data: data.details,
  });
  return response;
};

export const useUpdateBulkEnquiryDataMutation = () => {
  return useMutation({ mutationFn: update });
};
