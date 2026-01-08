import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TData = {
  details: TEnquiryData;
};

const update = async (data: TData) => {
  const user = store.getState().auth.authUser;
  const organization = store.getState().auth.selectedOrganization;

  const updatingData = {
    ...data.details,
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName + " " + user?.lastName,
      userCustomerEmail: user?.customerEmail,
      roleName: user?.userType,
    },
    customerID: organization?.customerId ?? "",
    organizationId: organization?.organizationId ?? "",
    callLogs: data.details.callLogs,
  };

  const response = await request({
    url: apiUrls.enquiry.UPDATE_ENQUIRY_DATA,
    method: "POST",
    data: updatingData,
  });
  return response;
};

export const useUpdateStudentEnquiryMutation = () => {
  return useMutation({ mutationFn: update });
};
