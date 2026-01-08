import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthenticationState {
  status:
    | "logout"
    | "authenticating"
    | "loggedIn"
    | "forceUpdate"
    | "network-error"
    | "organization"
    | "server-error";
  authUser: TAuthUser | undefined;
  userLoggedIn: boolean;
  isConnected: boolean;
  selectedOrganization:
    | Pick<
        TOrganizationName,
    "customerId" | "organizationName" | "organizationId" | "role" | "lastUpdatedDate"
      >
    | undefined;
}

const initialState: IAuthenticationState = {
  status: "authenticating",
  authUser: undefined,
  userLoggedIn: false,
  isConnected: false,
  selectedOrganization: undefined,
};

const authSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    // Authenticating
    authenticating(state) {
      state.status = "authenticating";
    },
    // Login
    login(state, action: PayloadAction<TAuthUser>) {
      AsyncStorage.setItem(`authUser`, JSON.stringify(action.payload));
      state.status = "loggedIn";
      state.authUser = action.payload;
      state.userLoggedIn = true;
    },
    //set Token
    setAuthUser(state, action: PayloadAction<TAuthUser>) {
      AsyncStorage.setItem(`authUser`, JSON.stringify(action.payload));
      state.authUser = action.payload;
    },

    // Logout
    logout(state) {
      AsyncStorage.removeItem(`authUser`);
      AsyncStorage.removeItem(`organization`);
      state.status = "logout";
      state.authUser = undefined;
      state.selectedOrganization = undefined;
    },

    forceUpdate(state) {
      state.status = "forceUpdate";
      state.authUser = undefined;
    },

    updateNetworkError(state) {
      state.status = "network-error";
    },
    updateServerError(state) {
      state.status = "server-error";
    },
    updateNetworkStatus(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setOrganization: (
      state,
      action: PayloadAction<
        | Pick<
            TOrganizationName,
            "customerId" | "organizationName" | "organizationId" | "role" | "lastUpdatedDate"
          >
        | undefined
      >
    ) => {
      console.log("=== SET ORGANIZATION LOGS ===");
      console.log("Setting organization:", action.payload);
      console.log("Organization customerId:", action.payload?.customerId);
      console.log("Organization organizationId:", action.payload?.organizationId);
      console.log("Organization name:", action.payload?.organizationName);
      console.log("Last updated date:", action.payload?.lastUpdatedDate);
      console.log("=== END SET ORGANIZATION LOGS ===");
      
      AsyncStorage.setItem(`organization`, JSON.stringify(action.payload));
      state.selectedOrganization = action.payload;
      state.status = "organization";
    },

    updateNavigator: (
      state,
      action: PayloadAction<typeof initialState.status>
    ) => {
      state.status = action.payload;
    },
  },
});

export const {
  login,
  authenticating,
  logout,
  setAuthUser,
  forceUpdate,
  updateNetworkError,
  updateServerError,
  updateNetworkStatus,
  setOrganization,
  updateNavigator,
} = authSlice.actions;

export default authSlice.reducer;