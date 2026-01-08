import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TData = {
  formTemplateId: string;
  formId: string[];
  id: string[];
  flag: "enquiry" | "singleForm" | "bulkForm";
  leadManager: TSelectedManager;
};

const update = async (data: TData) => {
  const organization = store.getState().auth.selectedOrganization;

  const updatingData = {
    ...data,
    customerID: organization?.customerId ?? "",
    organizationId: organization?.organizationId ?? "",
  };

  const response = await request({
    url: apiUrls.enquiry.UPDATE_LEAD_MANAGER,
    method: "POST",
    data: updatingData,
  });
  return response;
};

export const useUpdateLeadManagerMutation = () => {
  return useMutation({ mutationFn: update });
};
