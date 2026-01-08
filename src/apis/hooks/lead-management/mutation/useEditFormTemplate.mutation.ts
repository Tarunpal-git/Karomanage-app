import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TData = {
  template: TFormTemplate;
};

const update = async (data: TData) => {
  const user = store.getState().auth.authUser;

  const updateData = {
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.userType,
    },
    ...data.template,
  };

  const response = await request({
    url: apiUrls.enquiry.UPDATE_FORM_TEMPLATE,
    method: "POST",
    data: updateData,
  });
  return response;
};

export const useEditFormTemplateMutation = () => {
  return useMutation({ mutationFn: update });
};
