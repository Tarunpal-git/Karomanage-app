import { useQuery } from "@tanstack/react-query";

import { apiUrls } from "../../../urls";
import axios from "axios";
import Config from "react-native-config";
import { store } from "../../../../app/store";

const get = async (
  organization:
    | Pick<TOrganizationName, "customerId" | "organizationId" |  "lastUpdatedDate">
    | undefined
) => {
  const response = await axios({
    url: `${Config.REACT_APP_API_BASE_QUERY}/${apiUrls.enquiry.FETCH_ENQUIRY_LIST}`,
    method: "GET",
    headers: {
      "Ocp-Apim-Subscription-Key": Config.REACT_APP_SUBSCRIPTION_KEY,
    },
    params: {
      customerID: organization?.customerId,
      organizationId: organization?.organizationId,
    },
  });

  return response.data;
};

export const useEnquiryListsQuery = () => {
  const organization = store.getState().auth.selectedOrganization;

  return useQuery({
    queryKey: [apiUrls.enquiry.FETCH_ENQUIRY_LIST, organization],
    queryFn: () => get(organization),
  });
};