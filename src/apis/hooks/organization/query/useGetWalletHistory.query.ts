import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useAppSelector } from "../../../../app/hooks";

const get = async (
  customerId: string,
  organizationId: string,
  walletId: string
) => {
  const response = await request({
    url: apiUrls.wallet.GET_WALLET_HISTORY,
    method: "GET",
    params: {
      customerId,
      organizationId,
      walletId,
    },
  });
  return response;
};

export const useGetWalletHistoryQuery = (enabled: boolean = true) => {
  const { selectedOrganization } = useAppSelector((state) => state.auth);
  const { organization } = useAppSelector((state) => state.organization);

  const customerId = selectedOrganization?.customerId || organization.customerId;
  const organizationId =
    selectedOrganization?.organizationId || organization.organizationId;
  const walletId = organization.walletId;

  return useQuery({
    queryKey: [
      apiUrls.wallet.GET_WALLET_HISTORY,
      customerId,
      organizationId,
      walletId,
    ],
    queryFn: () => get(customerId, organizationId, walletId),
    enabled: enabled && !!customerId && !!organizationId && !!walletId,
  });
};


