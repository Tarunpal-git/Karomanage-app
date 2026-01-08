import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IOrganizationState {
  organization: TOrganizationName;
}

const initialState: IOrganizationState = {
  organization: {
    customerId: "",
    lastUpdatedDate: 0,
    organizationAddress: "",
    organizationDetails: "",
    organizationEmail: "",
    organizationId: "",
    organizationIntegrations: [],
    organizationName: "",
    organizationPhoneNumber: "",
    organizationRazorPayCustomerId: "",
    organizationSubscriptions: [],
    organizationCity: "",
    role: {
      permissions: [],
      roleCreatedDate: 0,
      roleId: "",
      rolelastModified: 0,
      roleName: "",
      roleStatus: "",
    },
    organizationCountry: "",
    organizationLogo: "",
    organizationPinCode: "",
    organizationPlan: {
      planName: "",
      planPricing: 0,
      planQuantity: 0,
      planType: "",
    },
    organizationState: "",
    organizationWhatsapp: {},
    walletId: "",
  },
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    updateOrganization: (state, action: PayloadAction<TOrganizationName>) => {
      state.organization = action.payload;
    },
    updateInitialOrganization: (state) => {
      state.organization = initialState.organization;
    },
  },
});

export const { updateOrganization, updateInitialOrganization } =
  organizationSlice.actions;

export default organizationSlice.reducer;
