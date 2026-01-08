// import { store } from "../../../../../app/store";

// export const filterMobileNumbers = (
//   mobileCallLogs: TCallHistory[],
//   enquiryCallLogs: TCallHistory[],
//   filteredNumber: string
// ) => {
//   const organization = store.getState().organization.organization;
//   const loggedInUser = store.getState().auth.authUser;

//   // Function to normalize phone numbers
//   const normalizePhoneNumber = (number: string) => {
//     // Remove any non-digit characters
//     const digits = number.replace(/\D/g, '');
//     // Remove leading 91 if present
//     return digits.replace(/^91/, '');
//   };

//   console.log('Filtering for number:', filteredNumber);
  
//   return mobileCallLogs
//     .filter((record) => {
//       const normalizedLogNumber = normalizePhoneNumber(record.phoneNumber);
//       const normalizedFilterNumber = normalizePhoneNumber(filteredNumber);
      
//       console.log('Comparing:', {
//         logNumber: record.phoneNumber,
//         normalized: normalizedLogNumber,
//         filterNumber: filteredNumber,
//         normalizedFilter: normalizedFilterNumber,
//         matches: normalizedLogNumber === normalizedFilterNumber
//       });
      
//       return normalizedLogNumber === normalizedFilterNumber;
//     })
//     .map((log) => ({
//       ...log,
//       callBy: {
//         name: loggedInUser?.customerName ?? "",
//         mobile: organization.organizationPhoneNumber ?? "",
//       },
//     }));
// };