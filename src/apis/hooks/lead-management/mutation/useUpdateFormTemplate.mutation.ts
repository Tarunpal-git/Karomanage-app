import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TData = {
  formTemplateId: string;
  formStatus: string;
};

const update = async (data: TData) => {
  const organization = store.getState().auth.selectedOrganization;
  const user = store.getState().auth.authUser;

  const updateData = {
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.userType,
    },
    customerId: user?.customerId,
    organizationId: organization?.organizationId,
    formTemplateId: data.formTemplateId,
    formStatus: data.formStatus,
  };

  const response = await request({
    url: apiUrls.enquiry.UPDATE_FORM_TEMPLATE_STATUS,
    method: "POST",
    data: updateData,
  });
  return response;
};

export const useUpdateFormTemplateMutation = () => {
  return useMutation({ mutationFn: update });
};
