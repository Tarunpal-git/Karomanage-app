import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { ORGANIZATION_PREFIX } from "../../../../constants";
import { store } from "../../../../app/store";

const get = async () => {
  const customerId = store.getState().auth.authUser?.customerId;
  const response = await request({
    url: apiUrls.organization.FETCH_ORGANIZATION_LISTS,
    method: "GET",
    params: {
      customerId,
    },
  });
  return response;
};

export const useOrganizationsListQuery = () => {
  return useQuery({
    queryKey: [
      ORGANIZATION_PREFIX,
      apiUrls.organization.FETCH_ORGANIZATION_LISTS,
    ],
    queryFn: get,
  });
};
