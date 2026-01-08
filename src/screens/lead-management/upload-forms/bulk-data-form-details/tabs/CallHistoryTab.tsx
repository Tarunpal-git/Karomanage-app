// import { NativeModules, Platform, StyleSheet, View, Alert } from "react-native";
// import { useIsFocused } from "@react-navigation/native";
// import React, { FC, memo, useEffect, useState, useCallback } from "react";
// import { Col, Grid, Row } from "react-native-easy-grid";
// import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
// import { COLORS } from "../../../../../colors";
// import moment from "moment";
// import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
// import { convertDurationToMinutes } from "../../../../../utils/covertDurationToMinutes";
// import { useUpdateUploadFormStatusMutation } from "../../../../../apis/hooks/upload-forms/mutation/useUpdateUploadFormStatus.mutation";

// const { CallLog } = NativeModules;

// interface ICallHistoryTab {
//   enquiryDetails: TBulkDataEnquiry;
// }

// const findPhoneNumberKey = (formData: any): string => {
//   const phoneKeys = [
//     'PHONE NUMBER', 
//     'PHONE_NUMBER', 
//     'mobile', 
//     'contact',
//     'phone'
//   ];

//   const foundKey = Object.keys(formData).find(key => 
//     phoneKeys.some(phoneKey => 
//       key.toLowerCase().includes(phoneKey.toLowerCase())
//     )
//   );

//   return foundKey || '';
// };

// const normalizePhoneNumber = (number: string): string => {
//   if (!number) return '';
//   const digitsOnly = number.replace(/\D/g, '');
  
//   // Handle multiple country code formats
//   const countryCodeRegex = /^((\+|00)(91|1|44))?/;
//   const normalized = digitsOnly.replace(countryCodeRegex, '');
  
//   return normalized.slice(-10);
// };

// const filterMobileNumbers = (
//   mobileCallLogs: TCallHistory[],
//   enquiryDetails: TBulkDataEnquiry
// ): TCallHistory[] => {
//   try {
//     const phoneNumberKey = findPhoneNumberKey(enquiryDetails.formData);
//     const mobileNumber = normalizePhoneNumber(enquiryDetails.formData[phoneNumberKey]);

//     console.log('Phone Number Detection:', {
//       key: phoneNumberKey,
//       originalNumber: enquiryDetails.formData[phoneNumberKey],
//       normalizedNumber: mobileNumber
//     });

//     return mobileCallLogs.filter(log => {
//       const normalizedLogNumber = normalizePhoneNumber(log.phoneNumber);
//       return normalizedLogNumber === mobileNumber;
//     }).map(log => ({
//       ...log,
//       callBy: {
//         name: enquiryDetails.formData["COACHINGS NAME"] || 'Unknown',
//         mobile: enquiryDetails.formData[phoneNumberKey] || ''
//       }
//     }));
//   } catch (error) {
//     console.error('Filtering Error:', error);
//     return [];
//   }
// };

// const CallHistoryTab: FC<ICallHistoryTab> = ({ enquiryDetails }) => {
//   const isFocused = useIsFocused();
//   const [logs, setLogs] = useState<TCallHistory[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { mutateAsync } = useUpdateUploadFormStatusMutation();

//   // Initialize logs from existing call logs
//   useEffect(() => {
//     if (enquiryDetails.formData.callLogs?.length) {
//       const sortedLogs = [...enquiryDetails.formData.callLogs].sort(
//         (a, b) => new Date(b.callDate).getTime() - new Date(a.callDate).getTime()
//       );
//       setLogs(sortedLogs);
//       setIsLoading(false);
//     }
//   }, [enquiryDetails.formData.callLogs]);

//   const checkCallLogPermission = useCallback(async () => {
//     if (Platform.OS !== 'android') {
//       setError('Call logs only available on Android');
//       return false;
//     }

//     try {
//       const permissionStatus = await check(PERMISSIONS.ANDROID.READ_CALL_LOG);
      
//       if (permissionStatus === RESULTS.DENIED) {
//         const requestResult = await request(PERMISSIONS.ANDROID.READ_CALL_LOG);
//         return requestResult === RESULTS.GRANTED;
//       }

//       return permissionStatus === RESULTS.GRANTED;
//     } catch (err) {
//       console.error('Permission check error:', err);
//       setError('Failed to check call log permissions');
//       return false;
//     }
//   }, []);

//   const fetchCallLogs = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const phoneNumberKey = findPhoneNumberKey(enquiryDetails.formData);
//       if (!enquiryDetails.formData.callLogs?.length && !enquiryDetails.formData[phoneNumberKey]) {
//         setError('No mobile number provided');
//         return;
//       }

//       const hasPermission = await checkCallLogPermission();
//       if (!hasPermission) {
//         setError('Call log permission denied');
//         return;
//       }

//       const callLogs: TCallHistory[] = await CallLog.getCallLogs(500);
//       console.log('Raw call logs count:', callLogs.length);

//       if (callLogs?.length > 0) {
//         const filteredLogs = filterMobileNumbers(callLogs, enquiryDetails);
//         console.log('Filtered logs count:', filteredLogs.length);

//         const sortedLogs = filteredLogs.sort(
//           (a, b) => new Date(b.callDate).getTime() - new Date(a.callDate).getTime()
//         );

//         setLogs(sortedLogs);

//         try {
//           const updatedEnquiryDetails = {
//             ...enquiryDetails,
//             formData: {
//               ...enquiryDetails.formData,
//               callLogs: sortedLogs
//             }
//           };

//           await mutateAsync({ details: updatedEnquiryDetails });
//         } catch (mutationError) {
//           console.error('Failed to update call logs:', mutationError);
//         }
//       } else {
//         setError('No call logs found');
//       }
//     } catch (error) {
//       console.error('Fetch call logs error:', error);
//       setError('Failed to fetch call logs');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [enquiryDetails, mutateAsync, checkCallLogPermission]);

//   // Trigger fetch when screen is focused and no logs exist
//   useEffect(() => {
//     if (isFocused && (!logs.length || error)) {
//       fetchCallLogs();
//     }
//   }, [isFocused, logs.length, error, fetchCallLogs]);

//   // Render loading state
//   if (isLoading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ScalableText style={styles.loadingText} fontFamily={"Medium"}>
//           Loading call history...
//         </ScalableText>
//       </View>
//     );
//   }

//   // Render error state
//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <ScalableText style={styles.errorText} fontFamily={"Medium"}>
//           {error}
//         </ScalableText>
//       </View>
//     );
//   }

//   // Render logs or empty state
//   return (
//     <View style={styles.rootContainer}>
//       <Grid style={styles.tableContainer}>
//         <Row style={styles.headerRow}>
//           {['Date & Time', 'Call By', 'Interval', 'Status'].map((title, index) => (
//             <Col 
//               key={title} 
//               style={styles.headerColumn} 
//               size={index === 0 ? 40 : index === 1 ? 35 : index === 2 ? 30 : 25}
//             >
//               <ScalableText style={styles.headerTitle} fontFamily="Medium">
//                 {title}
//               </ScalableText>
//             </Col>
//           ))}
//         </Row>

//         {logs.length > 0 ? (
//           logs.map((log) => (
//             <Row key={log.callDateMillis} style={styles.dataRow}>
//               <Col style={styles.dataColumn} size={40}>
//                 <ScalableText style={styles.dataText} fontFamily={"Medium"}>
//                   {moment(log.callDate).format("DD-MM-YYYY")}
//                 </ScalableText>
//                 <ScalableText style={styles.dataMutedText} fontFamily={"Medium"}>
//                   {moment(log.callDate).format("hh:mm A")}
//                 </ScalableText>
//               </Col>
//               <Col style={styles.dataColumn} size={35}>
//                 <ScalableText style={styles.dataText} fontFamily={"Medium"}>
//                   {log.callBy.name || 'Unknown'}
//                 </ScalableText>
//                 <ScalableText style={styles.dataMutedText} fontFamily={"Medium"}>
//                   {log.callBy.mobile || log.phoneNumber}
//                 </ScalableText>
//               </Col>
//               <Col style={styles.dataColumn} size={30}>
//                 <ScalableText style={styles.dataText} fontFamily={"Medium"}>
//                   {(() => {
//                     const duration = convertDurationToMinutes(log.callDuration);
//                     return `${duration.hours ? `${duration.hours}h ` : ''}${duration.minutes ? `${duration.minutes}m ` : ''}${duration.seconds}s`;
//                   })()}
//                 </ScalableText>
//               </Col>
//               <Col style={styles.dataColumn} size={25}>
//                 <ScalableText style={styles.dataText} fontFamily={"Medium"}>
//                   {log.callType}
//                 </ScalableText>
//               </Col>
//             </Row>
//           ))
//         ) : (
//           <Col style={styles.emptyContainer}>
//             <ScalableText style={styles.emptyText} fontFamily={"Medium"}>
//               No Call Logs Found
//             </ScalableText>
//           </Col>
//         )}
//       </Grid>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//     marginTop: 20,
//   },
//   tableContainer: {
//     backgroundColor: COLORS.white,
//     elevation: 4,
//     borderRadius: 10,
//   },
//   headerRow: {
//     backgroundColor: COLORS.primary,
//     height: 54,
//     paddingHorizontal: 10,
//   },
//   headerColumn: {
//     justifyContent: "center",
//   },
//   headerTitle: {
//     color: COLORS.white,
//     fontSize: 14,
//   },
//   dataRow: {
//     borderBottomColor: "#D1D1D1",
//     borderBottomWidth: 0.8,
//     height: 65,
//     paddingHorizontal: 10,
//   },
//   dataColumn: {
//     justifyContent: "center",
//   },
//   dataText: {
//     fontSize: 12,
//   },
//   dataMutedText: {
//     fontSize: 11,
//     color: COLORS.muted,
//     marginTop: 5,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     fontSize: 16,
//     color: COLORS.primary,
//   },
//   errorText: {
//     fontSize: 16,
//     color: "red",
//   },
//   emptyContainer: {
//     height: 250,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: 16,
//     color: COLORS.muted,
//   },
// });

// export default memo(CallHistoryTab);