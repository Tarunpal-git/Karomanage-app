// import { store } from "../../../../app/store";

// export const filterMobileNumbers = (
//   // mobileCallLogs: TCallHistory[],
//   // _enquiryCallLogs: TCallHistory[],
//   filteredNumber: string
// ) => {
//   const organization = store.getState().organization.organization;
//   const loggedInUser = store.getState().auth.authUser;

//   return mobileCallLogs
//     .filter(
//       (record) => record.phoneNumber.replace("+91", "") === filteredNumber
//     )
//     .map((log) => ({
//       ...log,
//       callBy: {
//         name: loggedInUser?.customerName ?? "",
//         mobile: organization.organizationPhoneNumber ?? "",
//       },
//     }));
// };
