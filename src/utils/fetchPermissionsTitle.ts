import { store } from "../app/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Enhanced Permission System
 * 
 * This system checks if users have specific actions (read, create, update, delete) 
 * for features instead of just checking if the feature title exists.
 * 
 * Note: API returns inconsistent data formats:
 * - Organization list: action: [0, 0, 0, 0] (numbers)
 * - Organization details: action: ["read", "create", "update", "delete"] (strings)
 * 
 * This system handles both formats.
 * 
 * Owner Logic:
 * - Organization owners always have all permissions
 * - Sub-users only get permissions based on their role
 * 
 * Permission Types:
 * - hasAnyPermissionSync(): Shows module if user has ANY permission (read, create, update, delete)
 * - hasAnyCRUDPermissionSync(): Shows CRUD buttons if user has create, update, or delete permission
 * 
 * Example usage:
 * 
 * // Show module if user has any permission (including read-only)
 * const canAccessDashboard = hasAnyPermissionSync("Dashboard");
 * 
 * // Show CRUD buttons if user can create, update, or delete
 * const canManageStudents = hasAnyCRUDPermissionSync("Student");
 * 
 * // Check specific permissions
 * const canReadStudents = hasReadPermission("Student");
 * const canCreateStudents = hasCreatePermission("Student");
 * const canUpdateStudents = hasUpdatePermission("Student");
 * const canDeleteStudents = hasDeletePermission("Student");
 * 
 * // Check if user has multiple specific actions
 * const canManageStudents = hasMultipleActionPermissions("Student", ["read", "create", "update"]);
 * 
 * // Get all available CRUD actions for a feature
 * const studentActions = getFeatureActions("Student"); // Returns ["create", "update", "delete"]
 */

// Helper function to get organization data from AsyncStorage
const getOrganizationData = async () => {
  try {
    const organizationData = await AsyncStorage.getItem('organization');
    return organizationData ? JSON.parse(organizationData) : null;
  } catch (error) {
    console.error("Error getting organization data:", error);
    return null;
  }
};

const fetchPermissionsTitle = () => {
  const { permissions } = store.getState().organization.organization.role;
  return permissions
    .filter((permission) => permission.title)
    .map((permission) => permission.title);
};

// Helper function to check if user is organization owner
const isOrganizationOwner = (): boolean => {
  const authState = store.getState().auth;
  const organizationState = store.getState().organization;
  
  // If no auth user or organization, return false
  if (!authState.authUser || !authState.selectedOrganization) {
    return false;
  }
  
  // Check if current user is the organization owner
  const currentUserId = authState.authUser.customerId;
  const organizationOwnerId = authState.selectedOrganization.customerId;
  
  return currentUserId === organizationOwnerId;
};

// Helper function to check if action is valid (not 0 or empty)
const isValidAction = (action: any): boolean => {
  if (typeof action === 'number') {
    return action !== 0;
  }
  if (typeof action === 'string') {
    return action !== '0' && action !== '' && action !== 'read'; // Only allow create, update, delete
  }
  return false;
};

// Helper function to normalize action for comparison
const normalizeAction = (action: any): string => {
  if (typeof action === 'number') {
    // Convert number to string action based on position
    const actionMap = ['read', 'create', 'update', 'delete'];
    return actionMap[action - 1] || '';
  }
  return action;
};

const CRUD_ACTIONS: ('read' | 'create' | 'update' | 'delete')[] = [
  'read',
  'create',
  'update',
  'delete',
];

const normalizeActionsArray = (
  actions: any[]
): ('read' | 'create' | 'update' | 'delete')[] => {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions
    .map((action: any) => normalizeAction(action))
    .filter(
      (action): action is ('read' | 'create' | 'update' | 'delete') =>
        CRUD_ACTIONS.includes(action as any)
    );
};

const findFeaturePermission = (roleData: any, feature: TAppFeatures) => {
  if (!roleData) {
    return null;
  }

  // Normalize feature name for comparison (remove spaces + lowercase)
  const normalizedFeature = feature.replace(/\s+/g, "").toLowerCase();

  if (Array.isArray(roleData)) {
    return roleData.find((permission: any) => 
      permission.title &&
      permission.title.replace(/\s+/g, "").toLowerCase() === normalizedFeature
    );
  }

  if (roleData && typeof roleData === 'object') {
    if (Array.isArray(roleData.permissions)) {
      return roleData.permissions.find(
        (permission: any) =>
          permission.title &&
          permission.title.replace(/\s+/g, "").toLowerCase() === normalizedFeature
      );
    }
  }

  return null;
};

const getFeaturePermissionActionsSync = (
  feature: TAppFeatures
): ('read' | 'create' | 'update' | 'delete')[] => {
  if (isOrganizationOwner()) {
    return [...CRUD_ACTIONS];
  }

  const authState = store.getState().auth;
  const organizationState = store.getState().organization;
  const potentialSources = [
    authState.selectedOrganization?.role,
    organizationState.organization?.role,
  ];

  for (const source of potentialSources) {
    const featurePermission = findFeaturePermission(source, feature);
    if (featurePermission?.action) {
      const normalized = normalizeActionsArray(featurePermission.action);
      if (normalized.length) {
        return normalized;
      }
    }
  }

  return [];
};

// Helper function to check if user has any valid permission (read, create, update, delete)
const hasAnyValidPermission = (actions: any[]): boolean => {
  return actions.some((action: any) => {
    const normalizedAction = normalizeAction(action);
    return normalizedAction === 'read' || normalizedAction === 'create' || normalizedAction === 'update' || normalizedAction === 'delete';
  });
};

// Helper function to check if user has any CRUD permission (create, update, delete)
const hasAnyCRUDPermission = (actions: any[]): boolean => {
  return actions.some((action: any) => {
    const normalizedAction = normalizeAction(action);
    return normalizedAction === 'create' || normalizedAction === 'update' || normalizedAction === 'delete';
  });
};

// Enhanced permission checking functions
export const hasPermission = (feature: TAppFeatures) => {
  const permissions = fetchPermissionsTitle();
  if (permissions.includes(feature)) {
    return true;
  } else {
    return false;
  }
};

// Synchronous version for React components - shows module if user has ANY permission (read, create, update, delete)
export const hasAnyPermissionSync = (feature: TAppFeatures) => {
  // If user is organization owner, always return true
  if (isOrganizationOwner()) {
    return true;
  }
  
  // Try to get organization data from Redux store first
  const authState = store.getState().auth;
  const organizationState = store.getState().organization;
  
  // Check multiple sources for permission data (same as getFeaturePermissionActionsSync)
  const potentialSources = [
    authState.selectedOrganization?.role,
    organizationState.organization?.role,
  ];
  
  // Debug logging for Timetable (can be removed later)
  if (feature === "Timetable") {
    console.log("🔍 DEBUG Timetable Permission Check:");
    console.log("  - Is Owner:", isOrganizationOwner());
    console.log("  - authState.selectedOrganization?.role:", authState.selectedOrganization?.role);
    console.log("  - organizationState.organization?.role:", organizationState.organization?.role);
    console.log("  - All permission titles from authState:", 
      authState.selectedOrganization?.role && typeof authState.selectedOrganization.role === 'object' && !Array.isArray(authState.selectedOrganization.role) && authState.selectedOrganization.role.permissions
        ? authState.selectedOrganization.role.permissions.map((p: any) => p.title)
        : Array.isArray(authState.selectedOrganization?.role)
        ? authState.selectedOrganization.role.map((p: any) => p.title)
        : "N/A"
    );
    console.log("  - All permission titles from organizationState:", 
      organizationState.organization?.role && typeof organizationState.organization.role === 'object' && !Array.isArray(organizationState.organization.role) && organizationState.organization.role.permissions
        ? organizationState.organization.role.permissions.map((p: any) => p.title)
        : Array.isArray(organizationState.organization?.role)
        ? organizationState.organization.role.map((p: any) => p.title)
        : "N/A"
    );
  }
  
  for (const source of potentialSources) {
    if (!source) continue;
    
    // Check if role is an array (from AsyncStorage) or object with permissions (from Redux)
    const role = source as any;
    
    // If role is an object with permissions property, use that
    if (role && typeof role === 'object' && !Array.isArray(role) && role.permissions) {
      const permissions = role.permissions;
      // Use case-insensitive comparison (ignore spaces)
      const normalizedFeature = feature.replace(/\s+/g, "").toLowerCase();
      const featurePermission = permissions.find(
        (permission: any) =>
          permission.title &&
          permission.title.replace(/\s+/g, "").toLowerCase() === normalizedFeature
      );
      
      if (feature === "Timetable") {
        console.log("  - Found permission object:", featurePermission);
        console.log("  - Searching for:", normalizedFeature);
        console.log("  - Available titles:", permissions.map((p: any) => p.title));
      }
      
      if (featurePermission && featurePermission.action) {
        const hasPermission = hasAnyValidPermission(featurePermission.action);
        if (feature === "Timetable") {
          console.log("  - hasAnyValidPermission result:", hasPermission);
        }
        return hasPermission;
      }
    }
    
    // If role is directly an array (from AsyncStorage)
    if (Array.isArray(role)) {
      // Use case-insensitive comparison (ignore spaces)
      const normalizedFeature = feature.replace(/\s+/g, "").toLowerCase();
      const featurePermission = role.find(
        (permission: any) =>
          permission.title &&
          permission.title.replace(/\s+/g, "").toLowerCase() === normalizedFeature
      );
      
      if (feature === "Timetable") {
        console.log("  - Found permission in array:", featurePermission);
        console.log("  - Searching for:", normalizedFeature);
        console.log("  - Available titles:", role.map((p: any) => p.title));
      }
      
      if (featurePermission && featurePermission.action) {
        const hasPermission = hasAnyValidPermission(featurePermission.action);
        if (feature === "Timetable") {
          console.log("  - hasAnyValidPermission result:", hasPermission);
        }
        return hasPermission;
      }
    }
  }
  
  // Fallback: return false if no data found
  if (feature === "Timetable") {
    console.log("  - ❌ No permission found, returning false");
  }
  return false;
};

// Async version for non-React contexts
export const hasAnyPermission = async (feature: TAppFeatures) => {
  // If user is organization owner, always return true
  if (isOrganizationOwner()) {
    return true;
  }
  
  const organizationData = await getOrganizationData();
  if (!organizationData || !organizationData.role) {
    console.log("No organization data found for permission check");
    return false;
  }
  
  const featurePermission = organizationData.role.find(
    (permission: any) => permission.title === feature
  );
  
  if (!featurePermission || !featurePermission.action) {
    return false;
  }
  
  // Check if user has any CRUD permission (create, update, delete)
  return hasAnyCRUDPermission(featurePermission.action);
};

// Function to check specific action permission
export const hasActionPermission = (feature: TAppFeatures, action: 'read' | 'create' | 'update' | 'delete') => {
  // If user is organization owner, always return true
  if (isOrganizationOwner()) {
    return true;
  }
  
  // Try to get organization data from Redux store first
  const authState = store.getState().auth;
  const organizationState = store.getState().organization;
  
  // Check multiple sources for permission data (same as getFeaturePermissionActionsSync)
  const potentialSources = [
    authState.selectedOrganization?.role,
    organizationState.organization?.role,
  ];
  
  // Normalize feature name for comparison (ignore spaces)
  const normalizedFeature = feature.replace(/\s+/g, "").toLowerCase();
  
  for (const source of potentialSources) {
    if (!source) continue;
    
    // Check if role is an array (from AsyncStorage) or object with permissions (from Redux)
    const role = source as any;
    
    // If role is an object with permissions property, use that
    if (role && typeof role === 'object' && !Array.isArray(role) && role.permissions) {
      const permissions = role.permissions;
      const featurePermission = permissions.find(
        (permission: any) =>
          permission.title &&
          permission.title.replace(/\s+/g, "").toLowerCase() === normalizedFeature
      );
      
      if (featurePermission && featurePermission.action) {
        return featurePermission.action.some((permAction: any) => {
          const normalizedAction = normalizeAction(permAction);
          return normalizedAction === action && isValidAction(permAction);
        });
      }
    }
    
    // If role is directly an array (from AsyncStorage)
    if (Array.isArray(role)) {
      const featurePermission = role.find(
        (permission: any) =>
          permission.title &&
          permission.title.replace(/\s+/g, "").toLowerCase() === normalizedFeature
      );
      
      if (featurePermission && featurePermission.action) {
        return featurePermission.action.some((permAction: any) => {
          const normalizedAction = normalizeAction(permAction);
          return normalizedAction === action && isValidAction(permAction);
        });
      }
    }
  }
  
  // Fallback: return false if no data found
  return false;
};

// Function to get all available CRUD actions for a feature (create, update, delete)
export const getFeatureActions = (feature: TAppFeatures) => {
  // If user is organization owner, return all CRUD actions
  if (isOrganizationOwner()) {
    return ['create', 'update', 'delete'];
  }
  
  const { permissions } = store.getState().organization.organization.role;
  const featurePermission = permissions.find(
    (permission) => permission.title === feature
  );
  
  if (!featurePermission || !featurePermission.action) {
    return [];
  }
  
  // Convert actions to normalized strings and filter CRUD actions
  return featurePermission.action
    .map((action: any) => normalizeAction(action))
    .filter((action: string) => action === 'create' || action === 'update' || action === 'delete');
};

export const hasOnlyReadPermission = (feature: TAppFeatures) => {
  const actions = getFeaturePermissionActionsSync(feature);
  const hasRead = actions.includes('read');
  const hasManageAccess = actions.some(
    (action) => action === 'create' || action === 'update' || action === 'delete'
  );

  return hasRead && !hasManageAccess;
};

export const shouldHidePaymentAmounts = (feature: TAppFeatures) => {
  return hasOnlyReadPermission(feature);
};

// Function to check if user has read permission for a feature
export const hasReadPermission = (feature: TAppFeatures) => {
  return hasActionPermission(feature, 'read');
};

// Function to check if user has create permission for a feature
export const hasCreatePermission = (feature: TAppFeatures) => {
  return hasActionPermission(feature, 'create');
};

// Function to check if user has update permission for a feature
export const hasUpdatePermission = (feature: TAppFeatures) => {
  return hasActionPermission(feature, 'update');
};

// Function to check if user has delete permission for a feature
export const hasDeletePermission = (feature: TAppFeatures) => {
  return hasActionPermission(feature, 'delete');
};

// Function to check if user has any CRUD permission (for buttons) - only create, update, delete
export const hasAnyCRUDPermissionSync = (feature: TAppFeatures) => {
  // If user is organization owner, always return true
  if (isOrganizationOwner()) {
    return true;
  }
  
  // Try to get organization data from Redux store first
  const authState = store.getState().auth;
  const organizationState = store.getState().organization;
  
  // Check multiple sources for permission data (same as getFeaturePermissionActionsSync)
  const potentialSources = [
    authState.selectedOrganization?.role,
    organizationState.organization?.role,
  ];
  
  // Normalize feature name for comparison (ignore spaces)
  const normalizedFeature = feature.replace(/\s+/g, "").toLowerCase();
  
  for (const source of potentialSources) {
    if (!source) continue;
    
    // Check if role is an array (from AsyncStorage) or object with permissions (from Redux)
    const role = source as any;
    
    // If role is an object with permissions property, use that
    if (role && typeof role === 'object' && !Array.isArray(role) && role.permissions) {
      const permissions = role.permissions;
      const featurePermission = permissions.find(
        (permission: any) =>
          permission.title &&
          permission.title.replace(/\s+/g, "").toLowerCase() === normalizedFeature
      );
      
      if (featurePermission && featurePermission.action) {
        return hasAnyCRUDPermission(featurePermission.action);
      }
    }
    
    // If role is directly an array (from AsyncStorage)
    if (Array.isArray(role)) {
      const featurePermission = role.find(
        (permission: any) =>
          permission.title &&
          permission.title.replace(/\s+/g, "").toLowerCase() === normalizedFeature
      );
      
      if (featurePermission && featurePermission.action) {
        return hasAnyCRUDPermission(featurePermission.action);
      }
    }
  }
  
  // Fallback: return false if no data found
  return false;
};

// Function to check if user has multiple specific actions for a feature
export const hasMultipleActionPermissions = (feature: TAppFeatures, actions: ('read' | 'create' | 'update' | 'delete')[]) => {
  // If user is organization owner, always return true
  if (isOrganizationOwner()) {
    return true;
  }
  
  const { permissions } = store.getState().organization.organization.role;
  const featurePermission = permissions.find(
    (permission) => permission.title === feature
  );
  
  if (!featurePermission) {
    return false;
  }
  
  return actions.every(action => hasActionPermission(feature, action));
};

// Debug function to log all available permissions
export const debugAllPermissions = () => {
  const authState = store.getState().auth;
  const organizationState = store.getState().organization;
  
  console.log("=== DEBUG ALL PERMISSIONS ===");
  console.log("Is Organization Owner:", isOrganizationOwner());
  
  // Check authState.selectedOrganization?.role
  if (authState.selectedOrganization?.role) {
    const role = authState.selectedOrganization.role as any;
    if (role && typeof role === 'object' && !Array.isArray(role) && role.permissions) {
      console.log("Permissions from authState.selectedOrganization.role.permissions:");
      role.permissions.forEach((p: any) => {
        console.log(`  - "${p.title}" with actions:`, p.action);
      });
    } else if (Array.isArray(role)) {
      console.log("Permissions from authState.selectedOrganization.role (array):");
      role.forEach((p: any) => {
        console.log(`  - "${p.title}" with actions:`, p.action);
      });
    }
  }
  
  // Check organizationState.organization?.role
  if (organizationState.organization?.role) {
    const role = organizationState.organization.role as any;
    if (role && typeof role === 'object' && !Array.isArray(role) && role.permissions) {
      console.log("Permissions from organizationState.organization.role.permissions:");
      role.permissions.forEach((p: any) => {
        console.log(`  - "${p.title}" with actions:`, p.action);
      });
    } else if (Array.isArray(role)) {
      console.log("Permissions from organizationState.organization.role (array):");
      role.forEach((p: any) => {
        console.log(`  - "${p.title}" with actions:`, p.action);
      });
    }
  }
  
  console.log("=== END DEBUG ALL PERMISSIONS ===");
};

// Debug function to log permission details
export const debugPermissions = (feature: TAppFeatures) => {
  const { permissions } = store.getState().organization.organization.role;
  const featurePermission = permissions.find(
    (permission) => permission.title === feature
  );
  
  console.log(`=== DEBUG PERMISSIONS FOR ${feature} ===`);
  console.log('Is Organization Owner:', isOrganizationOwner());
  console.log('Raw permission data:', featurePermission);
  
  if (featurePermission && featurePermission.action) {
    console.log('Action array:', featurePermission.action);
    console.log('Action types:', featurePermission.action.map((a: any) => typeof a));
    
    const normalizedActions = featurePermission.action
      .map((action: any) => ({
        original: action,
        normalized: normalizeAction(action),
        isValid: isValidAction(action)
      }));
    
    console.log('Normalized actions:', normalizedActions);
  }
  
  console.log('hasAnyPermission result:', hasAnyPermission(feature));
  console.log('hasReadPermission result:', hasReadPermission(feature));
  console.log('hasCreatePermission result:', hasCreatePermission(feature));
  console.log('hasUpdatePermission result:', hasUpdatePermission(feature));
  console.log('hasDeletePermission result:', hasDeletePermission(feature));
  console.log('getFeatureActions result:', getFeatureActions(feature));
  console.log(`=== END DEBUG PERMISSIONS FOR ${feature} ===`);
};

// Test function to check owner status and user details
export const debugOwnerStatus = () => {
  const authState = store.getState().auth;
  const organizationState = store.getState().organization;
  
  console.log('=== DEBUG OWNER STATUS ===');
  console.log('Auth User:', authState.authUser);
  console.log('Selected Organization:', authState.selectedOrganization);
  console.log('Current User ID:', authState.authUser?.customerId);
  console.log('Organization Owner ID:', authState.selectedOrganization?.customerId);
  console.log('Is Organization Owner:', isOrganizationOwner());
  console.log('=== END DEBUG OWNER STATUS ===');
};
