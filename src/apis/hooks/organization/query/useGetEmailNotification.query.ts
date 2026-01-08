import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useAppSelector } from "../../../../app/hooks";

const get = async (customerId: string, organizationId: string) => {
  const response = await request({
    url: apiUrls.organization.GET_EMAIL_NOTIFICATION,
    method: "GET",
    params: {
      customerId,
      organizationId,
    },
  });
  return response;
};

export const useGetEmailNotificationQuery = () => {
  const { selectedOrganization, authUser } = useAppSelector((state) => state.auth);

  const customerId =
    selectedOrganization?.customerId || authUser?.customerId || "";
  const organizationId = selectedOrganization?.organizationId || "";

  return useQuery({
    queryKey: [
      apiUrls.organization.GET_EMAIL_NOTIFICATION,
      customerId,
      organizationId,
    ],
    queryFn: () => get(customerId, organizationId),
    enabled: !!customerId && !!organizationId,
  });
};


