import { store } from "../app/store";

// Debug utility to check customerId and organizationId values
export const debugOrganizationValues = () => {
  const currentState = store.getState();
  
  console.log("🔍 === ORGANIZATION DEBUG LOGS ===");
  
  // Check auth user
  const authUser = currentState.auth.authUser;
  console.log("👤 Auth User:", authUser);
  console.log("👤 User customerId:", authUser?.customerId);
  console.log("👤 User employeeId:", authUser?.employeeId);
  
  // Check selected organization
  const selectedOrg = currentState.auth.selectedOrganization;
  console.log("🏢 Selected Organization:", selectedOrg);
  console.log("🏢 Organization customerId:", selectedOrg?.customerId);
  console.log("🏢 Organization organizationId:", selectedOrg?.organizationId);
  console.log("🏢 Organization name:", selectedOrg?.organizationName);
  
  // Check organization state
  const orgState = currentState.organization.organization;
  console.log("🏢 Organization State:", orgState);
  console.log("🏢 State customerId:", orgState.customerId);
  console.log("🏢 State organizationId:", orgState.organizationId);
  
  // Check if values are missing
  if (!selectedOrg?.customerId) {
    console.log("❌ WARNING: Selected organization customerId is missing!");
  }
  if (!selectedOrg?.organizationId) {
    console.log("❌ WARNING: Selected organization organizationId is missing!");
  }
  if (!authUser?.customerId) {
    console.log("❌ WARNING: Auth user customerId is missing!");
  }
  
  console.log("🔍 === END ORGANIZATION DEBUG LOGS ===");
  
  return {
    authUser,
    selectedOrganization: selectedOrg,
    organizationState: orgState,
    hasValidCustomerId: !!selectedOrg?.customerId,
    hasValidOrganizationId: !!selectedOrg?.organizationId,
    hasValidUserCustomerId: !!authUser?.customerId
  };
};

// Function to check values before API calls
export const checkValuesBeforeApiCall = (apiName: string) => {
  console.log(`🚀 === PRE-API CALL CHECK (${apiName}) ===`);
  const debugInfo = debugOrganizationValues();
  
  if (!debugInfo.hasValidCustomerId || !debugInfo.hasValidOrganizationId) {
    console.log("⚠️  WARNING: Missing required organization values for API call!");
  }
  
  console.log(`🚀 === END PRE-API CALL CHECK (${apiName}) ===`);
  return debugInfo;
}; 