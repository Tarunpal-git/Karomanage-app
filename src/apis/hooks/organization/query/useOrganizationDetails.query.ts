import { useQuery } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { ORGANIZATION_PREFIX } from "../../../../constants";
import { store } from "../../../../app/store";
import { logout } from "../../../../app/reducer/auth/auth-reducer";
import { updateOrganization } from "../../../../app/reducer/organization/organization-reducer";

const get = async () => {
  const response = await request({
    url: apiUrls.organization.FETCH_ORGANIZATION_DETAILS,
    method: "GET",
  });

  if (response.statusCode === 200) {
    store.dispatch(updateOrganization(response.data));
  } else {
    // Don't logout on API errors, just log the error
    console.log("Organization details API error:", response.statusCode, response.message);
    // Only logout on authentication errors (401, 403)
    if (response.statusCode === 401 || response.statusCode === 403) {
      console.log("Non-authentication error, not logging out");
      // store.dispatch(logout());
    }
  }

  return response;
};

export const useOrganizationDetailsQuery = () => {
  const organization = store.getState().auth.selectedOrganization;
  return useQuery({
    queryKey: [ORGANIZATION_PREFIX, organization?.organizationId],
    queryFn: () => get(),
  });
};
