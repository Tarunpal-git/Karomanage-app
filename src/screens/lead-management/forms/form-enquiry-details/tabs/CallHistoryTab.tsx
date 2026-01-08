

// import { NativeModules, Platform, StyleSheet, View } from "react-native";
// import React, { FC, memo, useEffect, useState } from "react";
// import { Col, Grid, Row } from "react-native-easy-grid";
// import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
// import { COLORS } from "../../../../../colors";
// import moment from "moment";
// import { PERMISSIONS, RESULTS, request } from "react-native-permissions";

// import { convertDurationToMinutes } from "../../../../../utils/covertDurationToMinutes";
// import { filterMobileNumbers } from "../utils/filterMobileNumbers";
// import { useUpdateFormEnquiryMutation } from "../../../../../apis/hooks/lead-management/mutation/useUpdateFormEnquiry.mutation";

// const { CallLog } = NativeModules;

// interface ICallHistoryTab {
//   enquiryDetails: TFormEnquiry;
// }

// const CallHistoryTab: FC<ICallHistoryTab> = ({ enquiryDetails }) => {
//   const [logs, setLogs] = useState<TCallHistory[]>(
//     enquiryDetails.formData.callLogs ?? []
//   );
//   const { mutateAsync } = useUpdateFormEnquiryMutation();

//   const fetchCallLogs = async (limit: number) => {
//     if (Platform.OS === "android") {
//       const permission = await request(PERMISSIONS.ANDROID.READ_CALL_LOG);
//       if (permission === RESULTS.GRANTED) {
//         try {
//           const callLogs: TCallHistory[] = await CallLog.getCallLogs(limit);

//           if (callLogs.length > 0) {
//             const filteredData = filterMobileNumbers(
//               callLogs,
//               logs,
//               enquiryDetails.formData.mobileNumber
//             );

//             setLogs(filteredData);

//             enquiryDetails.formData.callLogs = filteredData;

//             await mutateAsync({
//               details: enquiryDetails,
//             });
//           } else {
//             setLogs([]);
//           }
//         } catch (e) {
//           console.error(e);
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     fetchCallLogs(500);
//   }, []);

//   return (
//     <View style={styles.rootContainer}>
//       <Grid style={styles.tableContainer}>
//         <Row style={styles.headerRow}>
//           <Col style={styles.headerColumn} size={40}>
//             <ScalableText style={styles.headerTitle} fontFamily="Medium">
//               {"Date &\nTime"}
//             </ScalableText>
//           </Col>
//           <Col style={styles.headerColumn} size={35}>
//             <ScalableText style={styles.headerTitle} fontFamily="Medium">
//               Call By
//             </ScalableText>
//           </Col>
//           <Col style={styles.headerColumn} size={30}>
//             <ScalableText style={styles.headerTitle} fontFamily="Medium">
//               Interval
//             </ScalableText>
//           </Col>
//           <Col style={styles.headerColumn} size={25}>
//             <ScalableText style={styles.headerTitle} fontFamily="Medium">
//               Status
//             </ScalableText>
//           </Col>
//         </Row>
//         {logs.map((log) => (
//           <Row key={log.callDate} style={styles.dataRow}>
//             <Col style={styles.dataColumn} size={40}>
//               <ScalableText style={styles.dataText} fontFamily="Regular">
//                 {moment(log.callDate).format("DD-MM-YYYY")}
//               </ScalableText>
//               <ScalableText style={styles.dataMutedText} fontFamily="Regular">
//                 {moment(log.callDate).format("hh:mm A")}
//               </ScalableText>
//             </Col>
//             <Col style={styles.dataColumn} size={35}>
//               <ScalableText style={styles.dataText} fontFamily="Regular">
//                 {log.callBy.name ?? ""}
//               </ScalableText>
//               <ScalableText style={styles.dataMutedText} fontFamily="Regular">
//                 {log.callBy.mobile ?? ""}
//               </ScalableText>
//             </Col>
//             <Col style={styles.dataColumn} size={30}>
//               <ScalableText style={styles.dataText} fontFamily="Regular">
//                 {convertDurationToMinutes(log.callDuration).hours > 0 &&
//                   `${convertDurationToMinutes(log.callDuration).hours}\n`}
//                 {convertDurationToMinutes(log.callDuration).minutes > 0 &&
//                   `${convertDurationToMinutes(log.callDuration).minutes} Min\n`}
//                 {convertDurationToMinutes(log.callDuration).seconds >= 0 &&
//                   `${convertDurationToMinutes(log.callDuration).seconds} Secs`}
//               </ScalableText>
//             </Col>
//             <Col style={styles.dataColumn} size={25}>
//               <ScalableText style={styles.dataText} fontFamily="Regular">
//                 {log.callType}
//               </ScalableText>
//             </Col>
//           </Row>
//         ))}
//         {logs.length === 0 && (
//           <Col
//             style={{ ...styles.dataColumn, height: 250, alignItems: "center" }}
//           >
//             <ScalableText fontFamily="SemiBold">No Record Found</ScalableText>
//           </Col>
//         )}
//       </Grid>
//     </View>
//   );
// };

// export default memo(CallHistoryTab);

// const styles = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//     paddingHorizontal: 0,
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
//     marginHorizontal: 10,
//     // paddingHorizontal: 10,
//   },
//   dataColumn: {
//     justifyContent: "center",
//     // alignItems: "center",
//   },
//   dataText: {
//     fontSize: 12,
//   },
//   dataMutedText: {
//     fontSize: 11,
//     color: COLORS.muted,
//     marginTop: 5,
//   },
// });
