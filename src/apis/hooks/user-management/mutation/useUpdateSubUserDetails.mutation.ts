import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

type TData = {
  details: {
    userId: string;
    userName: string;
    userSurname: string;
    designation: string;
    userStatus: string;
    userEmail: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assignedLeads: any[];
  };
};

const update = async (data: TData) => {
  const organization = store.getState().auth.selectedOrganization;

  const response = await request({
    url: apiUrls.userManagement.UPDATE_USER_DETAILS,
    method: "POST",
    data: {
      ...data.details,
      customerId: organization?.customerId,
      organizationId: organization?.organizationId,
    },
  });
  return response;
};

export const useUpdateSubUserDetailsMutation = () => {
  return useMutation({ mutationFn: update });
};
