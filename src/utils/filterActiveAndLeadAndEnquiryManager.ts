export const filterActiveAndLeadAndEnquiryManager = (
  managers: TUserListData[]
) => {
  return managers.filter((user) => {
    if (user.userStatus === "accepted" && user.role.permissions) {
      const permissions = user.role.permissions;

      const hasEnquiryRead = permissions.some(
        (permission) =>
          permission.title === "Enquiry" && permission.action.includes("read")
      );

      const hasLeadManagementRead = permissions.some(
        (permission) =>
          permission.title === "Lead Management" &&
          permission.action.includes("read")
      );

      return hasEnquiryRead || hasLeadManagementRead;
    }
    return false;
  });
};

// export const filterActiveAndLeadAndEnquiryManager = (
//   managers: TUserListData[]
// ) => {
//   return managers.filter((user) => {
//     if (user.userStatus === "accepted") {
//       return true;
//     }
//     return false;
//   });
// };
