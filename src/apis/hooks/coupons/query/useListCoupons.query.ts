import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { store } from "../../../../app/store";

const get = async () => {
  // Get organization data from store
  const selectedOrganization = store.getState().auth.selectedOrganization;
  
  if (!selectedOrganization) {
    throw new Error('No organization selected');
  }

  const response = await request({
    url: apiUrls.coupons.LIST_COUPON,
    method: "GET",
    params: {
      customerId: selectedOrganization.customerId,
      organizationId: selectedOrganization.organizationId,
    },
  });
  
  return response;
};

export const useListCouponsQuery = () => {
  return useQuery({
    queryKey: [apiUrls.coupons.LIST_COUPON],
    queryFn: get,
    select: (data) => {
      // Filter out inactive coupons and sort by date created
      if (data?.data) {
        return data.data
          .filter((coupon: any) => coupon.couponStatus !== "inActive")
          .sort((a: any, b: any) => b.dateCreated - a.dateCreated);
      }
      return [];
    },
  });
}; 