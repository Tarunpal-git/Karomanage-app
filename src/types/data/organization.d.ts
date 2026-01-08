type Permission = {
  title: string;
  action: string[];
  manageUser?: boolean;
};

type Role = {
  roleId: string;
  roleName: string;
  roleStatus: string;
  roleCreatedDate: number;
  rolelastModified: number;
  permissions: Permission[];
};

type OrganizationSubscription = {
  createdAt?: number;
  plan: string;
  trialEndsAt?: number;
  dateStarted?: number;
  paymentState?: string;
  paymentLink?: string;
  invoiceId?: string;
  expiryDate?: number;
  paymentDate?: number;
};

type GstRuleData = {
  cgstPercentage: number;
  sgstPercentage: number;
  cgstEnabled: boolean;
  sgstEnabled: boolean;
  inclusionType: 'noGST' | 'included' | 'excluded';
  gstinNumber: string;
};

type TOrganizationName = {
  customerId: string;
  organizationId: string;
  organizationName: string;
  organizationDetails: string;
  organizationPhoneNumber: string;
  organizationAddress: string;
  organizationEmail: string;
  lastUpdatedDate: number;
  role: {
    roleId: string;
    roleName: string;
    roleStatus: string;
    roleCreatedDate: number; // timestamp
    rolelastModified: number; // timestamp
    permissions: Array<{
      title: string;
      action: string[];
      manageUser?: boolean;
    }>;
  };
  organizationRazorPayCustomerId: string;
  organizationSubscriptions: Array<{
    createdAt: number; // timestamp
    plan: string;
    planType: string;
    planPricing: number;
    trialEndsAt: number; // timestamp
    paymentStarted: number; // timestamp
  }>;
  organizationIntegrations: any[];
  organizationCity: string;
  organizationState: string;
  organizationCountry: string;
  organizationPinCode: string;
  organizationPlan: {
    planName: string;
    planPricing: number;
    planType: string;
    planQuantity: number;
  };
  walletId: string;
  organizationWhatsapp: Record<string, any>;
  organizationLogo: string;
  lastUpdatedDate: number;
  gstRuleData?: GstRuleData;
};
