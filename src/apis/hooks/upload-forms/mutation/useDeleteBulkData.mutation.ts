import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TData = {
  formTemplateId: string;
};

const update = async (data: TData) => {
  const user = store.getState().auth.authUser;
  const organization = store.getState().auth.selectedOrganization;
  const updateData = {
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.userType,
    },
    organizationId: organization?.organizationId,
    customerId: user?.customerId,
    ...data,
  };

  const response = await request({
    url: apiUrls.uploadedForms.DELETE_BULK_DATA,
    method: "POST",
    data: updateData,
  });
  return response;
};

export const useDeleteBulkDataMutation = () => {
  return useMutation({ mutationFn: update });
};
