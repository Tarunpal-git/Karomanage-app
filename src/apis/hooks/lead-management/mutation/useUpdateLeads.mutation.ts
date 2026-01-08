import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { LEAD_MANAGEMENT_PREFIX } from "../../../../constants";
import { store } from "../../../../app/store";

type TData = Record<string, any>;

const updateLeads = async (data: TData) => {
  const organization = store.getState().auth.selectedOrganization;
  const user = store.getState().auth.authUser;

  const updateData = {
    ...data,
    customerId: organization?.customerId ?? "",
    organizationId: organization?.organizationId ?? "",
    
    user: {
      userCustomerId: user?.customerId,
      userCustomerName: user?.customerName,
      userCustomerEmail: user?.customerEmail,
      
      roleName: user?.userType,
    },
  };

  const response = await request({
    url: LEAD_MANAGEMENT_PREFIX + "updateLeads",
    method: "POST",
    data: updateData,
  });
  return response;
};

export const useUpdateLeadsMutation = () => {
  return useMutation({ mutationFn: updateLeads });
};

