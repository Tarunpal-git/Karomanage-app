interface AuthState {
    authUser: TAuthUser | null;
    selectedOrganization: {
      customerId: string;
      organizationId: string;
    } | null;
  }