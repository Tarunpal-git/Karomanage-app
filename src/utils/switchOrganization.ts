import { setOrganization } from "../app/reducer/auth/auth-reducer";
import { store } from "../app/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { request } from "../services/axios.service";
import { apiUrls } from "../apis/urls";

// Utility function to log current store state
export const logCurrentOrganizationState = () => {
  const currentState = store.getState();
  console.log("=== CURRENT STORE STATE LOGS ===");
  console.log("Auth State:", currentState.auth);
  console.log("Selected Organization:", currentState.auth.selectedOrganization);
  console.log("Auth User:", currentState.auth.authUser);
  console.log("Organization State:", currentState.organization);
  console.log("=== END CURRENT STORE STATE LOGS ===");
};

// API call to get complete organization details
const getSingleOrganization = async (customerId: string, organizationId: string) => {
  try {
    const response = await request({
      url: apiUrls.organization.FETCH_ORGANIZATION_DETAILS,
      method: "GET",
      params: { customerId, organizationId }
    });
    return response;
  } catch (error) {
    console.error("Error fetching organization details:", error);
    return null;
  }
};

// API call to get email notification permissions
const getEmailNotifications = async (customerId: string, organizationId: string) => {
  try {
    const response = await request({
      url: apiUrls.notificationHub?.LIST_EMAIL_NOTIFICATIONS || "notifications/listEmailNotification",
      method: "GET",
      params: { customerId, organizationId }
    });
    return response;
  } catch (error) {
    console.error("Error fetching email notifications:", error);
    return null;
  }
};

// API call to get module visit status
const getModuleVisitStatus = async (customerId: string, organizationId: string) => {
  try {
    const response = await request({
      url: apiUrls.modules?.GET_MODULE_VISIT_STATUS || "modules/getAllModuleVisitStatus",
      method: "GET",
      params: { customerId, organizationId }
    });
    return response;
  } catch (error) {
    console.error("Error fetching module visit status:", error);
    return null;
  }
};

export const handleSwitchOrganization = async (
  organization?: Pick<
    TOrganizationName,
    "customerId" | "organizationName" | "organizationId" | "role" | "lastUpdatedDate"
  >
) => {
  console.log("=== SWITCH ORGANIZATION LOGS ===");
  console.log("Switching to organization:", organization);
  console.log("Organization customerId:", organization?.customerId);
  console.log("Organization organizationId:", organization?.organizationId);
  console.log("Organization name:", organization?.organizationName);
  console.log("Last updated date:", organization?.lastUpdatedDate);

  let updatedOrganization;
  if (organization) {
    // Check organization expiry (only if lastUpdatedDate exists)
    if (organization.lastUpdatedDate) {
      const createdDate = new Date(organization.lastUpdatedDate);
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - createdDate.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      console.log("Days difference:", daysDifference);
      console.log("Organization expired:", daysDifference > 5);

      if (daysDifference > 5) {
        console.log("WARNING: Organization is expired!");
        customAlert.show({ message: "This Organization is expired" });
        return;
      }
    } else {
      console.log("WARNING: No lastUpdatedDate found, skipping expiry check");
    }

    try {
      // Get complete organization details
      // Use subUser's customerId (from authUser) instead of organization's customerId
      const authUser = store.getState().auth.authUser;
      const subUserCustomerId = authUser?.customerId;
      console.log("subUserCustomerId", subUserCustomerId);
      
      if (!subUserCustomerId) {
        console.log("ERROR: No authUser customerId found");
        customAlert.show({ message: "User authentication error"});
        return;
      }

      const orgDetailsResponse = await getSingleOrganization(
        subUserCustomerId,
        organization.organizationId
      );
      console.log("orgDetailsResponse", orgDetailsResponse);

       updatedOrganization = { ...organization, ...orgDetailsResponse.data.data}; 

      if (orgDetailsResponse?.data?.data) {
        const apiData = orgDetailsResponse.data.data;
        // Merge organization object with API data, preserving original fields
        updatedOrganization = {
          ...organization,
          ...apiData,
        };

        // Store organization logo separately
        if ((updatedOrganization as any).organizationLogo) {
          await AsyncStorage.setItem(
            'organizationLogo', 
            JSON.stringify({ logo: (updatedOrganization as any).organizationLogo })
          );
        }
      }
      // Store complete organization data
      await AsyncStorage.setItem('organization', JSON.stringify(updatedOrganization));
      await AsyncStorage.getItem('organization');
      console.log("Tarun-subscription",organization,orgDetailsResponse, updatedOrganization.subscription);

      // Get email notification permissions (handle 404 gracefully)
      try {
        const emailNotificationsResponse = await getEmailNotifications(
          subUserCustomerId,
          organization.organizationId
        );

        if (emailNotificationsResponse?.statusCode !== 404) {
          await AsyncStorage.setItem(
            'messageRestriction',
            JSON.stringify(emailNotificationsResponse?.data?.notificationPermissions || {})
          );
        } else {
          await AsyncStorage.setItem('messageRestriction', JSON.stringify({}));
        }
      } catch (error) {
        console.log("Email notifications API not available, using empty restrictions");
        await AsyncStorage.setItem('messageRestriction', JSON.stringify({}));
      }

      // Get module visit status (handle 404 gracefully)
      try {
        const moduleVisitResponse = await getModuleVisitStatus(
          subUserCustomerId,
          organization.organizationId
        );

        if (moduleVisitResponse?.data) {
          await AsyncStorage.setItem(
            'moduleVisitStatus', 
            JSON.stringify(moduleVisitResponse.data)
          );
        }
      } catch (error) {
        console.log("Module visit status API not available, skipping");
      }

      console.log("Dispatching setOrganization action...");
      store.dispatch(setOrganization(updatedOrganization));
      console.log("Organization switch completed successfully");

    } catch (error) {
      console.error("Error during organization switch:", error);
      // Fallback to basic organization data
      store.dispatch(setOrganization(updatedOrganization));
    }

  } else {
    console.log("ERROR: No organization provided for switching");
    customAlert.show({ message: "Select an organization first" });
  }
  console.log("=== END SWITCH ORGANIZATION LOGS ===");
};