import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TData = {
  details: TFormEnquiry;
};

const update = async (data: TData) => {
  const user = store.getState().auth.authUser;

  const updateData = {
    ...data.details,
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.userType,
    },
  };

  const response = await request({
    url: apiUrls.enquiry.UPDATE_FORM_ENQUIRY,
    method: "POST",
    data: updateData,
  });
  return response;
};

export const useUpdateFormEnquiryMutation = () => {
  return useMutation({ mutationFn: update });
};
