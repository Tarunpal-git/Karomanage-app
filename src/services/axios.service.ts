import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Config from "react-native-config";
import { logout, updateServerError } from "../app/reducer/auth/auth-reducer";
import { store } from "../app/store";

const client = axios.create({ baseURL: `${Config.REACT_APP_API_BASE_QUERY}` });

client.interceptors.request.use((config) => {
  const organization = store.getState().auth.selectedOrganization;
  const authUser = store.getState().auth.authUser;

  // Log organization and user details
  console.log("=== AXIOS INTERCEPTOR LOGS ===");
  console.log("Selected Organization:", organization);
  console.log("Auth User:", authUser);
  console.log("Organization customerId:", organization?.customerId);
  console.log("Organization organizationId:", organization?.organizationId);
  console.log("User customerId:", authUser?.customerId);
  console.log("Request URL:", config.url);
  console.log("Request Method:", config.method);
  console.log("Request Params (before):", config.params);
  console.log("Request Data:", JSON.stringify(config.data, null, 2));

  config.params = config.params || {};

  if (organization) {
    config.params["customerId"] = organization.customerId;
    config.params["organizationId"] = organization?.organizationId;
    
    console.log("Added customerId to params:", organization.customerId);
    console.log("Added organizationId to params:", organization.organizationId);
  } else {
    console.log("WARNING: No organization found in store!");
  }
  
  console.log("Request Params (after):", config.params);
  console.log("=== END AXIOS INTERCEPTOR LOGS ===");
  
  return config;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = async (options: AxiosRequestConfig<any>) => {
  console.log("=== REQUEST FUNCTION LOGS ===");
  console.log("Request Options:", options);
  console.log("Request URL:", options.url);
  console.log("Request Method:", options.method);
  console.log("Request Data:", JSON.stringify(options.data, null, 2));
  console.log("Request Params:", options.params);
  
  // Log current store state
  const currentState = store.getState();
  console.log("Current Auth State:", currentState.auth);
  console.log("Current Organization State:", currentState.organization);
  console.log("=== END REQUEST FUNCTION LOGS ===");

  client.defaults.headers.common[
    `${Config.REACT_APP_SUBSCRIPTION_HEADER}`
  ] = `${Config.REACT_APP_SUBSCRIPTION_KEY}`;

  const onSuccess = (response: AxiosResponse) => {
    console.log("=== RESPONSE SUCCESS LOGS ===");
    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(response.data, null, 2));
    console.log("=== END RESPONSE SUCCESS LOGS ===");
    return response.data;
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => {
    console.log("=== RESPONSE ERROR LOGS ===");
    console.log("Error:", error);
    console.log("Error Message:", error.message);
    console.log("Error Response:", error.response);
    console.log("=== END RESPONSE ERROR LOGS ===");
    
    // Only logout on 401 authentication errors, not on other errors
    if (error.response?.status === 401) {
      console.log("Authentication error (401), logging out user");
      store.dispatch(logout());
    } else {
      console.log("Non-authentication error, not logging out");
    }

    return error.response;
  };

  try {
    const response = await client(options);

    return onSuccess(response);
  } catch (error: unknown) {
    const newError = error as { message: string };
    if (
      newError.message === "Network Error" &&
      store.getState().auth.isConnected
    ) {
      store.dispatch(updateServerError());
    }
    return onError(error);
  }
};
