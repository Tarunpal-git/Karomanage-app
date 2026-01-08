interface RoleInfoAction {
  title: string;
  action: (string | number)[];
}

interface RoleInfo {
  customerId: string;
  customerName: string;
  userType: string;
  action: RoleInfoAction[];
  date: number;
}

interface Permission {
  title: string;
  action: (string | number)[];
  manageUser?: boolean;
}

interface Role {
  roleId: string;
  roleName: string;
  roleStatus: string;
  roleCreatedDate: number;
  roleInfo: RoleInfo[];
  permissions: Permission[];
}

interface TUserListData {
  customerId: string;
  organizationId: string;
  organizationName: string;
  organizationDetails: string;
  organizationPhoneNumber: string;
  organizationEmail: string;
  organizationAddress: string;
  userName: string;
  designation: string;
  userId: string;
  employeeId: string;
  userEmail: string;
  userStatus: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignedLeads: any[];
  userCreatedDate: number;
  lastUpdatedDate: number;
  role: Role;
}

type TSelectedManager = {
  managerName: string;
  designation: string;
  employeeId: string;
  managerEmail: string;
  userId: string;
};
