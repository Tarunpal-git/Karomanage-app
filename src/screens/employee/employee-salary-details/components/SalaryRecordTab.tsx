// import React from "react";
// import { View, Text } from "react-native";
// import Center from "../../../../@ui/center/Center";

// const SalaryRecordTab = ({ employeeId }) => {
//   return (
//     <View style={{ padding: 15 }}>
//       <Center>
//         <Text style={{ fontSize: 16, color: "gray" }}>
//           No Salary Records Available
//         </Text>
//       </Center>
//     </View>
//   );
// };

// export default SalaryRecordTab;


// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryRecordTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Record</Text>

//         <View style={styles.centerBox}>
//           <Text style={styles.noData}>No Salary Record Found</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },
//   title: { fontSize: 18, fontWeight: "bold", color: "#000", marginBottom: 15 },
//   centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
//   noData: { color: "gray", fontSize: 15 },
// });

// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryRecordTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Details</Text>

//         {/* TABLE HEADER */}
//         <View style={styles.headerRow}>

//           {/* SERIAL NO. */}
//           <View style={styles.col}>
//             <Text style={styles.headerText}>SERIAL NO.</Text>
//           </View>

//           {/* MONTHLY SALARY RECORD */}
//           <View style={styles.col}>
//             <Text style={styles.headerText}>MONTHLY</Text>
//             <Text style={styles.headerText}>SALARY RECORD</Text>
//           </View>

//           {/* VIEW */}
//           <View style={[styles.col, { alignItems: "flex-end" }]}>
//             <Text style={styles.headerText}>VIEW SALARY</Text>
//           </View>
//         </View>

//         {/* NO DATA */}
//         <View style={styles.centerBox}>
//           <Text style={styles.noData}>No data found</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 15,
//   },

//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#e5e5e5",
//   },

//   col: {
//     flex: 1, // ⭐ equal width for all columns
//     justifyContent: "center",
//   },

//   headerText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },

//   centerBox: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   noData: {
//     color: "gray",
//     fontSize: 15,
//   },
// });


// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
// } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// // ✅ STATIC DATA
// const salaryList = ["2025-12"];

// const SalaryRecordTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Details</Text>

//         {/* ===== TABLE HEADER ===== */}
//         <View style={styles.headerRow}>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>SERIAL NO.</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={styles.headerText}>MONTHLY</Text>
//             <Text style={styles.headerText}>SALARY RECORD</Text>
//           </View>

//           <View style={[styles.col, { alignItems: "flex-end" }]}>
//             <Text style={styles.headerText}>VIEW</Text>
//           </View>
//         </View>

//         {/* ===== DATA ROW ===== */}
//         {salaryList.map((item, index) => (
//           <View key={index} style={styles.dataRow}>
//             {/* SERIAL NO */}
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{index + 1}</Text>
//             </View>

//             {/* MONTH */}
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{item}</Text>
//             </View>

//             {/* VIEW ICON */}
//             <View style={[styles.col, { alignItems: "flex-end" }]}>
//               <TouchableOpacity>
//                 <Text style={styles.viewText}>👁</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 15,
//   },

//   headerRow: {
//     flexDirection: "row",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#e5e5e5",
//   },

//   dataRow: {
//     flexDirection: "row",
//     paddingVertical: 14,
//     borderBottomWidth: 0.5,
//     borderColor: "#eee",
//   },

//   col: {
//     flex: 1,
//     justifyContent: "center",
//   },

//   headerText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },

//   dataText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111",
//   },

//   viewText: {
//     fontSize: 18,
//   },
// });


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   Modal,
// } from "react-native";
// import { COLORS } from "../../../../colors";
// import AttendanceTab from "./AttendanceTab"; // 👈 SAME TAB IMPORT

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryRecordTab = ({ employeeId }) => {
//   const [showAttendance, setShowAttendance] = useState(false);

//   // 🔹 STATIC DATA (abhi)
//   const salaryList = ["2025-12"];

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Details</Text>

//         {/* ===== HEADER ===== */}
//         <View style={styles.headerRow}>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>SERIAL NO.</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={styles.headerText}>MONTHLY</Text>
//             <Text style={styles.headerText}>SALARY RECORD</Text>
//           </View>

//           <View style={[styles.col, { alignItems: "flex-end" }]}>
//             <Text style={styles.headerText}>VIEW</Text>
//           </View>
//         </View>

//         {/* ===== DATA ===== */}
//         {salaryList.map((item, index) => (
//           <View key={index} style={styles.dataRow}>
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{index + 1}</Text>
//             </View>

//             <View style={styles.col}>
//               <Text style={styles.dataText}>{item}</Text>
//             </View>

//             <View style={[styles.col, { alignItems: "flex-end" }]}>
//               <TouchableOpacity onPress={() => setShowAttendance(true)}>
//                 <Text style={styles.viewText}>👁</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </View>

//       {/* ================= MODAL ================= */}
//       <Modal visible={showAttendance} animationType="slide">
//         <View style={{ flex: 1, backgroundColor: "#F5F6FA" }}>
//           {/* CLOSE */}
//           <TouchableOpacity
//             onPress={() => setShowAttendance(false)}
//             style={styles.closeBtn}
//           >
//             <Text style={{ color: "#fff", fontWeight: "bold" }}>CLOSE</Text>
//           </TouchableOpacity>

//           {/* ATTENDANCE CALENDAR */}
//           <AttendanceTab employeeId={employeeId} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },

//   headerRow: {
//     flexDirection: "row",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#e5e5e5",
//   },

//   dataRow: {
//     flexDirection: "row",
//     paddingVertical: 14,
//     borderBottomWidth: 0.5,
//     borderColor: "#eee",
//   },

//   col: {
//     flex: 1,
//     justifyContent: "center",
//   },

//   headerText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },

//   dataText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111",
//   },

//   viewText: {
//     fontSize: 18,
//   },

//   closeBtn: {
//     backgroundColor: COLORS.primary,
//     padding: 12,
//     alignItems: "center",
//   },
// });


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   Modal,
//   Pressable,
// } from "react-native";
// import { COLORS } from "../../../../colors";
// import AttendanceTab from "./AttendanceTab";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryRecordTab = ({ employeeId }) => {
//   const [showAttendance, setShowAttendance] = useState(false);

//   // 🔹 STATIC DATA (abhi)
//   const salaryList = ["2025-12"];

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Details</Text>

//         {/* ===== HEADER ===== */}
//         <View style={styles.headerRow}>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>SERIAL NO.</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={styles.headerText}>MONTHLY</Text>
//             <Text style={styles.headerText}>SALARY RECORD</Text>
//           </View>

//           <View style={[styles.col, { alignItems: "flex-end" }]}>
//             <Text style={styles.headerText}>VIEW</Text>
//           </View>
//         </View>

//         {/* ===== DATA ===== */}
//         {salaryList.map((item, index) => (
//           <View key={index} style={styles.dataRow}>
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{index + 1}</Text>
//             </View>

//             <View style={styles.col}>
//               <Text style={styles.dataText}>{item}</Text>
//             </View>

//             <View style={[styles.col, { alignItems: "flex-end" }]}>
//               <TouchableOpacity onPress={() => setShowAttendance(true)}>
//                 <Text style={styles.viewText}>👁</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </View>

//       {/* ================= POPUP MODAL ================= */}
//       <Modal
//         visible={showAttendance}
//         transparent
//         animationType="fade"
//       >
//         {/* BACKDROP */}
//         <Pressable
//           style={styles.backdrop}
//           onPress={() => setShowAttendance(false)}
//         />

//         {/* POPUP CARD */}
//         <View style={styles.popupWrapper}>
//           <View style={styles.popupCard}>
//             {/* HEADER */}
//             <View style={styles.popupHeader}>
//               <Text style={styles.popupTitle}>Attendance</Text>
//               <TouchableOpacity onPress={() => setShowAttendance(false)}>
//                 <Text style={styles.closeText}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             {/* CONTENT */}
//             <AttendanceTab employeeId={employeeId} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },

//   headerRow: {
//     flexDirection: "row",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#e5e5e5",
//   },

//   dataRow: {
//     flexDirection: "row",
//     paddingVertical: 14,
//     borderBottomWidth: 0.5,
//     borderColor: "#eee",
//   },

//   col: {
//     flex: 1,
//     justifyContent: "center",
//   },

//   headerText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },

//   dataText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111",
//   },

//   viewText: {
//     fontSize: 18,
//   },

//   /* ===== MODAL ===== */

//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//   },

//   popupWrapper: {
//     position: "absolute",
//     top: "10%",
//     left: 0,
//     right: 0,
//     alignItems: "center",
//   },

//   popupCard: {
//     width: "92%",
//     height: "100%",
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     overflow: "hidden",
//     elevation: 10,
//   },

//   popupHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 14,
//     backgroundColor: COLORS.primary,
//   },

//   popupTitle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   closeText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });


// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryRecordTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Details</Text>

//         {/* TABLE HEADER */}
//         <View style={styles.headerRow}>

//           {/* SERIAL NO. */}
//           <View style={styles.col}>
//             <Text style={styles.headerText}>SERIAL NO.</Text>
//           </View>

//           {/* MONTHLY SALARY RECORD */}
//           <View style={styles.col}>
//             <Text style={styles.headerText}>MONTHLY</Text>
//             <Text style={styles.headerText}>SALARY RECORD</Text>
//           </View>

//           {/* VIEW */}
//           <View style={[styles.col, { alignItems: "flex-end" }]}>
//             <Text style={styles.headerText}>VIEW SALARY</Text>
//           </View>
//         </View>

//         {/* NO DATA */}
//         <View style={styles.centerBox}>
//           <Text style={styles.noData}>No data found</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 15,
//   },

//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#e5e5e5",
//   },

//   col: {
//     flex: 1, // ⭐ equal width for all columns
//     justifyContent: "center",
//   },

//   headerText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },

//   centerBox: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   noData: {
//     color: "gray",
//     fontSize: 15,
//   },
// });

// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryRecordTab = ({ employeeId }) => {

//   // 🔹 STATIC DATA (temporary)
//   const salaryList = [
//     {
//       id: 1,
//       month: "2025-12",
//     },
//   ];

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Details</Text>

//         {/* TABLE HEADER */}
//         <View style={styles.headerRow}>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>SERIAL NO.</Text>
//           </View>

//           <View style={styles.col}>
//             <Text style={styles.headerText}>MONTHLY</Text>
//             <Text style={styles.headerText}>SALARY RECORD</Text>
//           </View>

//           <View style={[styles.col, { alignItems: "flex-end" }]}>
//             <Text style={styles.headerText}>VIEW SALARY</Text>
//           </View>
//         </View>

//         {/* TABLE ROW */}
//         {salaryList.map((item, index) => (
//           <View key={item.id} style={styles.dataRow}>
//             {/* SERIAL NO */}
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{index + 1}</Text>
//             </View>

//             {/* MONTH */}
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{item.month}</Text>
//             </View>

//             {/* VIEW (EMOJI) */}
//             <View style={[styles.col, { alignItems: "flex-end" }]}>
//               <Text style={styles.viewEmoji}>👁️</Text>
//             </View>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 15,
//   },

//   headerRow: {
//     flexDirection: "row",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#e5e5e5",
//   },

//   dataRow: {
//     flexDirection: "row",
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "#f0f0f0",
//   },

//   col: {
//     flex: 1,
//     justifyContent: "center",
//   },

//   headerText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },

//   dataText: {
//     fontSize: 14,
//     color: "#333",
//   },

//   viewEmoji: {
//     fontSize: 14,
//     color: "#0B4DA2",
//     fontWeight: "600",
//   },
// });

// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";
// import { useSingleEmployeeMonthlyAttendanceQuery } from
//   "D:/Projects/Karomanage-mobile-android-app/src/apis/hooks/employee/query/useSingleEmployeeMonthlyAttendance.query";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryRecordTab = ({ employeeId }) => {
//   /* ================= STATE ================= */
//   const [showAttendance, setShowAttendance] = useState(false);

//   /* ================= SALARY DATA ================= */
//   const salaryList = [
//     { id: 1, month: "2025-12" },
//   ];

//   /* ================= ATTENDANCE LOGIC (UNCHANGED) ================= */
//   const today = dayjs();
//   const [currentMonth, setCurrentMonth] = useState(today);

//   const month = currentMonth.format("MM");
//   const year = currentMonth.format("YYYY");

//   const { data, isLoading } =
//     useSingleEmployeeMonthlyAttendanceQuery({
//       employeeId,
//       month,
//       year,
//     });

//   const attendanceMap = useMemo(() => {
//     const map = {};
//     data?.data?.attendanceThisMonth?.forEach((item) => {
//       const day = Number(item.attendanceDate.slice(6, 8));

//       if (item.availablityStatus?.status === "HalfDay") {
//         map[day] = { status: "half", interval: item.availablityStatus.interval };
//       } else if (item.attendanceStatus === "present") {
//         map[day] = { status: "present" };
//       } else {
//         map[day] = { status: "absent" };
//       }
//     });
//     return map;
//   }, [data]);

//   const presentCount = Object.values(attendanceMap).filter(
//     (v) => v.status === "present"
//   ).length;
//   const absentCount = Object.values(attendanceMap).filter(
//     (v) => v.status === "absent"
//   ).length;
//   const halfCount = Object.values(attendanceMap).filter(
//     (v) => v.status === "half"
//   ).length;

//   const isCurrentMonth = currentMonth.isSame(today, "month");
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);
//   for (let d = 1; d <= totalDays; d++) {
//     if (isCurrentMonth && d > today.date()) break;
//     calendarCells.push(d);
//   }

//   /* ================= UI ================= */
//   return (
//     <View style={{ marginTop: 15 }}>
//       {/* ===== SALARY UI (UNCHANGED) ===== */}
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Details</Text>

//         <View style={styles.headerRow}>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>SERIAL NO.</Text>
//           </View>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>MONTHLY</Text>
//             <Text style={styles.headerText}>SALARY RECORD</Text>
//           </View>
//           <View style={[styles.col, { alignItems: "flex-end" }]}>
//             <Text style={styles.headerText}>VIEW SALARY</Text>
//           </View>
//         </View>

//         {salaryList.map((item, index) => (
//           <View key={item.id} style={styles.dataRow}>
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{index + 1}</Text>
//             </View>
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{item.month}</Text>
//             </View>
//             <View style={[styles.col, { alignItems: "flex-end" }]}>
//               <TouchableOpacity onPress={() => setShowAttendance(true)}>
//                 <Text style={styles.viewEmoji}>👁️</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </View>

//       {/* ===== ATTENDANCE POPUP ===== */}
//       <Modal visible={showAttendance} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity
//               style={styles.closeBtn}
//               onPress={() => setShowAttendance(false)}
//             >
//               <Text style={styles.closeText}>✕</Text>
//             </TouchableOpacity>

//             {isLoading ? (
//               <Text>Loading attendance...</Text>
//             ) : (
//               <ScrollView showsVerticalScrollIndicator={false}>
//                 <Text style={styles.title}>Attendance</Text>

//                 {/* ===== SUMMARY ===== */}
//                 <View style={styles.summaryCard}>
//                   <Text style={styles.summaryMonth}>
//                     {currentMonth.format("MMMM")}
//                   </Text>

//                   <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//                     <Text style={styles.tagText}>PRESENT : {presentCount}</Text>
//                   </View>

//                   <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//                     <Text style={styles.tagText}>ABSENT : {absentCount}</Text>
//                   </View>

//                   <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//                     <Text style={styles.tagText}>HALF DAY : {halfCount}</Text>
//                   </View>
//                 </View>

//                 {/* ===== MONTH HEADER ===== */}
//                 <View style={styles.monthHeader}>
//                   <TouchableOpacity
//                     style={styles.arrow}
//                     onPress={() =>
//                       setCurrentMonth(currentMonth.subtract(1, "month"))
//                     }
//                   >
//                     <Text style={styles.arrowText}>{"<"}</Text>
//                   </TouchableOpacity>

//                   <Text style={styles.monthTitle}>
//                     {currentMonth.format("MMMM YYYY")}
//                   </Text>

//                   <TouchableOpacity
//                     disabled={isCurrentMonth}
//                     style={[
//                       styles.arrow,
//                       isCurrentMonth && { backgroundColor: "#9CA3AF" },
//                     ]}
//                     onPress={() =>
//                       setCurrentMonth(currentMonth.add(1, "month"))
//                     }
//                   >
//                     <Text style={styles.arrowText}>{">"}</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* ===== WEEK DAYS ===== */}
//                 <View style={styles.weekRow}>
//                   {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                     <Text key={d} style={styles.weekDay}>{d}</Text>
//                   ))}
//                 </View>

//                 {/* ===== CALENDAR ===== */}
//                 <View style={styles.calendarGrid}>
//                   {calendarCells.map((day, index) => {
//                     if (!day)
//                       return <View key={index} style={styles.dayCell} />;

//                     const attendance = attendanceMap[day];
//                     const bg =
//                       attendance?.status === "present"
//                         ? "#7CDE3B"
//                         : attendance?.status === "absent"
//                         ? "#FFD5D5"
//                         : attendance?.status === "half"
//                         ? "#FFC107"
//                         : "transparent";

//                     const label =
//                       attendance?.status === "present"
//                         ? "Present"
//                         : attendance?.status === "absent"
//                         ? "Absent"
//                         : attendance?.status === "half"
//                         ? `Half Day ${attendance.interval ?? ""}`
//                         : "";

//                     return (
//                       <View
//                         key={index}
//                         style={[styles.dayCell, { backgroundColor: bg }]}
//                       >
//                         <Text style={styles.dayText}>{day}</Text>
//                         {label !== "" && (
//                           <Text style={styles.dayStatus}>{label}</Text>
//                         )}
//                       </View>
//                     );
//                   })}
//                 </View>
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// /* ================= STYLES (FULL) ================= */

// const styles = StyleSheet.create({
//   /* ===== SALARY ===== */
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },
//   headerRow: {
//     flexDirection: "row",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#e5e5e5",
//   },
//   dataRow: {
//     flexDirection: "row",
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "#f0f0f0",
//   },
//   col: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   headerText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },
//   dataText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   viewEmoji: {
//     fontSize: 14,
//     color: "#0B4DA2",
//     fontWeight: "600",
//   },

//   /* ===== MODAL ===== */
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     margin: 10,
//     padding: 10,
//   },
//   closeBtn: {
//     alignSelf: "flex-end",
//   },
//   closeText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },

//   /* ===== ATTENDANCE (UNCHANGED STYLES) ===== */
//   summaryCard: {
//     backgroundColor: "#fff",
//     width: 140,
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     elevation: 4,
//   },
//   summaryMonth: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 10,
//   },
//   tag: {
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     borderRadius: 6,
//     marginBottom: 6,
//   },
//   tagText: {
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   monthHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   arrow: {
//     backgroundColor: "#243447",
//     padding: 6,
//     borderRadius: 8,
//   },
//   arrowText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   monthTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   weekRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   weekDay: {
//     width: "14.28%",
//     textAlign: "center",
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },
//   calendarGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   dayCell: {
//     width: "14.28%",
//     paddingVertical: 8,
//     alignItems: "center",
//   },
//   dayText: {
//     color: "#111",
//     fontWeight: "600",
//   },
//   dayStatus: {
//     fontSize: 8,
//     marginTop: 2,
//     fontWeight: "700",
//     color: "#111",
//   },
// });

// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";
// import { useSingleEmployeeMonthlyAttendanceQuery } from
//   "D:/Projects/Karomanage-mobile-android-app/src/apis/hooks/employee/query/useSingleEmployeeMonthlyAttendance.query";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryRecordTab = ({ employeeId }) => {
//   /* ================= STATE ================= */
//   const [showAttendance, setShowAttendance] = useState(false);

//   /* ================= SALARY DATA ================= */
//   const salaryList = [{ id: 1, month: "2025-12" }];

//   /* ================= ATTENDANCE LOGIC ================= */
//   const today = dayjs();
//   const [currentMonth, setCurrentMonth] = useState(today);

//   const month = currentMonth.format("MM");
//   const year = currentMonth.format("YYYY");

//   const { data, isLoading } =
//     useSingleEmployeeMonthlyAttendanceQuery({
//       employeeId,
//       month,
//       year,
//     });

//   const attendanceMap = useMemo(() => {
//     const map = {};
//     data?.data?.attendanceThisMonth?.forEach((item) => {
//       const day = Number(item.attendanceDate.slice(6, 8));

//       if (item.availablityStatus?.status === "HalfDay") {
//         map[day] = { status: "half", interval: item.availablityStatus.interval };
//       } else if (item.attendanceStatus === "present") {
//         map[day] = { status: "present" };
//       } else {
//         map[day] = { status: "absent" };
//       }
//     });
//     return map;
//   }, [data]);

//   const presentCount = Object.values(attendanceMap).filter(
//     (v) => v.status === "present"
//   ).length;
//   const absentCount = Object.values(attendanceMap).filter(
//     (v) => v.status === "absent"
//   ).length;
//   const halfCount = Object.values(attendanceMap).filter(
//     (v) => v.status === "half"
//   ).length;

//   const isCurrentMonth = currentMonth.isSame(today, "month");
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);
//   for (let d = 1; d <= totalDays; d++) {
//     if (isCurrentMonth && d > today.date()) break;
//     calendarCells.push(d);
//   }

//   /* ================= UI ================= */
//   return (
//     <View style={{ marginTop: 15 }}>
//       {/* ===== SALARY LIST ===== */}
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Details</Text>

//         <View style={styles.headerRow}>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>SERIAL NO.</Text>
//           </View>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>MONTHLY</Text>
//             <Text style={styles.headerText}>SALARY RECORD</Text>
//           </View>
//           <View style={[styles.col, { alignItems: "flex-end" }]}>
//             <Text style={styles.headerText}>VIEW SALARY</Text>
//           </View>
//         </View>

//         {salaryList.map((item, index) => (
//           <View key={item.id} style={styles.dataRow}>
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{index + 1}</Text>
//             </View>
//             <View style={styles.col}>
//               <Text style={styles.dataText}>{item.month}</Text>
//             </View>
//             <View style={[styles.col, { alignItems: "flex-end" }]}>
//               <TouchableOpacity onPress={() => setShowAttendance(true)}>
//                 <Text style={styles.viewEmoji}>👁️</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </View>

//       {/* ===== ATTENDANCE POPUP ===== */}
//       <Modal visible={showAttendance} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity
//               style={styles.closeBtn}
//               onPress={() => setShowAttendance(false)}
//             >
//               <Text style={styles.closeText}>✕</Text>
//             </TouchableOpacity>

//             {isLoading ? (
//               <Text>Loading attendance...</Text>
//             ) : (
//               <ScrollView showsVerticalScrollIndicator={false}>
//                 <Text style={styles.title}>Attendance</Text>

//                 {/* ===== SUMMARY ROW ===== */}
//                 <View style={styles.summaryRow}>
//                   {/* LEFT: ATTENDANCE SUMMARY */}
//                   <View style={styles.summaryCard}>
//                     <Text style={styles.summaryMonth}>
//                       {currentMonth.format("MMMM")}
//                     </Text>

//                     <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//                       <Text style={styles.tagText}>
//                         PRESENT : {presentCount}
//                       </Text>
//                     </View>

//                     <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//                       <Text style={styles.tagText}>
//                         ABSENT : {absentCount}
//                       </Text>
//                     </View>

//                     <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//                       <Text style={styles.tagText}>
//                         HALF DAY : {halfCount}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* RIGHT: SALARY SUMMARY */}
//                   <View style={styles.salarySummaryCard}>
//                     <Text style={styles.salaryRow}>
//                       Monthly fixed salary:{" "}
//                       <Text style={styles.salaryValue}>2000</Text>
//                     </Text>
//                     <Text style={styles.salaryRow}>
//                       Total fixed salary:{" "}
//                       <Text style={styles.salaryValue}>32.26</Text>
//                     </Text>
//                     <Text style={styles.salaryRow}>
//                       Total salary deduction:{" "}
//                       <Text style={styles.salaryValue}>354.84</Text>
//                     </Text>
//                     <Text style={styles.salaryRow}>
//                       Per day salary:{" "}
//                       <Text style={styles.salaryValue}>64.52</Text>
//                     </Text>
//                   </View>
//                 </View>

//                 {/* ===== MONTH HEADER ===== */}
//                 <View style={styles.monthHeader}>
//                   <TouchableOpacity
//                     style={styles.arrow}
//                     onPress={() =>
//                       setCurrentMonth(currentMonth.subtract(1, "month"))
//                     }
//                   >
//                     <Text style={styles.arrowText}>{"<"}</Text>
//                   </TouchableOpacity>

//                   <Text style={styles.monthTitle}>
//                     {currentMonth.format("MMMM YYYY")}
//                   </Text>

//                   <TouchableOpacity
//                     disabled={isCurrentMonth}
//                     style={[
//                       styles.arrow,
//                       isCurrentMonth && { backgroundColor: "#9CA3AF" },
//                     ]}
//                     onPress={() =>
//                       setCurrentMonth(currentMonth.add(1, "month"))
//                     }
//                   >
//                     <Text style={styles.arrowText}>{">"}</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* ===== WEEK DAYS ===== */}
//                 <View style={styles.weekRow}>
//                   {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                     <Text key={d} style={styles.weekDay}>{d}</Text>
//                   ))}
//                 </View>

//                 {/* ===== CALENDAR ===== */}
//                 <View style={styles.calendarGrid}>
//                   {calendarCells.map((day, index) => {
//                     if (!day)
//                       return <View key={index} style={styles.dayCell} />;

//                     const attendance = attendanceMap[day];
//                     const bg =
//                       attendance?.status === "present"
//                         ? "#7CDE3B"
//                         : attendance?.status === "absent"
//                         ? "#FFD5D5"
//                         : attendance?.status === "half"
//                         ? "#FFC107"
//                         : "transparent";

//                     const label =
//                       attendance?.status === "present"
//                         ? "Present"
//                         : attendance?.status === "absent"
//                         ? "Absent"
//                         : attendance?.status === "half"
//                         ? `Half Day ${attendance.interval ?? ""}`
//                         : "";

//                     return (
//                       <View
//                         key={index}
//                         style={[styles.dayCell, { backgroundColor: bg }]}
//                       >
//                         <Text style={styles.dayText}>{day}</Text>
//                         {label !== "" && (
//                           <Text style={styles.dayStatus}>{label}</Text>
//                         )}
//                       </View>
//                     );
//                   })}
//                 </View>
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },
//   headerRow: {
//     flexDirection: "row",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#e5e5e5",
//   },
//   dataRow: {
//     flexDirection: "row",
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "#f0f0f0",
//   },
//   col: { flex: 1, justifyContent: "center" },
//   headerText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },
//   dataText: { fontSize: 14, color: "#333" },
//   viewEmoji: {
//     fontSize: 14,
//     color: "#0B4DA2",
//     fontWeight: "600",
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     margin: 10,
//     padding: 10,
//   },
//   closeBtn: { alignSelf: "flex-end" },
//   closeText: { fontSize: 18, fontWeight: "bold" },

//   summaryRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 20,
//   },
//   summaryCard: {
//     backgroundColor: "#fff",
//     width: 140,
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     elevation: 4,
//   },
//   summaryMonth: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 10,
//   },
//   tag: {
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     borderRadius: 6,
//     marginBottom: 6,
//   },
//   tagText: { fontSize: 12, fontWeight: "bold" },

//   salarySummaryCard: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     elevation: 4,
//     justifyContent: "center",
//   },
//   salaryRow: {
//     fontSize: 13,
//     color: "#374151",
//     marginBottom: 6,
//   },
//   salaryValue: {
//     fontWeight: "700",
//     color: "#111",
//   },

//   monthHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   arrow: {
//     backgroundColor: "#243447",
//     padding: 6,
//     borderRadius: 8,
//   },
//   arrowText: { color: "#fff", fontSize: 16 },
//   monthTitle: { fontSize: 18, fontWeight: "bold" },

//   weekRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   weekDay: {
//     width: "14.28%",
//     textAlign: "center",
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },
//   calendarGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   dayCell: {
//     width: "14.28%",
//     paddingVertical: 8,
//     alignItems: "center",
//   },
//   dayText: { color: "#111", fontWeight: "600" },
//   dayStatus: {
//     fontSize: 8,
//     marginTop: 2,
//     fontWeight: "700",
//     color: "#111",
//   },
// });




// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";
// import { useSingleEmployeeMonthlyAttendanceQuery } from
//   "D:/Projects/Karomanage-mobile-android-app/src/apis/hooks/employee/query/useSingleEmployeeMonthlyAttendance.query";
// import { useSingleSalaryQuery } from "../../../../apis/hooks/employee/query/useSingleSalary.query";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../app/store";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const SalaryRecordTab = ({ employeeId }: { employeeId: string }) => {
//   /* ================= STATE ================= */
//   const [showAttendance, setShowAttendance] = useState(false);
//   const [selectedSalaryMonth, setSelectedSalaryMonth] = useState<string | null>(null);

//   /* ================= ATTENDANCE LOGIC ================= */
//   const today = dayjs();
//   const [currentMonth, setCurrentMonth] = useState(today);

//   const month = currentMonth.format("MM");
//   const year = currentMonth.format("YYYY");

//   const { data, isLoading } =
//     useSingleEmployeeMonthlyAttendanceQuery({
//       employeeId,
//       month,
//       year,
//     });

//   /* ================= SALARY API CALLS ================= */
//   const { data: salaryData, isLoading: isLoadingSalary } = useSingleSalaryQuery({
//     employeeId,
//     month,
//     year,
//   });

//   const { data: modalSalaryData } = useSingleSalaryQuery({
//     employeeId,
//     month: selectedSalaryMonth ? selectedSalaryMonth.split("-")[1] : month,
//     year: selectedSalaryMonth ? selectedSalaryMonth.split("-")[0] : year,
//   });

//   /* ================= SALARY DATA ================= */
//   const salaryList = useMemo(() => {
//     if (salaryData?.statuscode === 200 && salaryData?.data) {
//       return [{
//         id: salaryData.data.salaryId,
//         month: `${year}-${month}`,
//         salaryData: salaryData.data
//       }];
//     }
//     return [];
//   }, [salaryData, month, year]);

//   const handleViewSalary = (monthYear: string) => {
//     setSelectedSalaryMonth(monthYear);
//     setShowAttendance(true);
//   };

//   const attendanceMap = useMemo(() => {
//     const map: Record<number, { status: string; interval?: string }> = {};
//     data?.data?.attendanceThisMonth?.forEach((item: any) => {
//       const day = Number(item.attendanceDate.slice(6, 8));

//       if (item.availablityStatus?.status === "HalfDay") {
//         map[day] = { status: "half", interval: item.availablityStatus.interval };
//       } else if (item.attendanceStatus === "present") {
//         map[day] = { status: "present" };
//       } else {
//         map[day] = { status: "absent" };
//       }
//     });
//     return map;
//   }, [data]);

//   const presentCount = Object.values(attendanceMap).filter(
//     (v: { status: string }) => v.status === "present"
//   ).length;
//   const absentCount = Object.values(attendanceMap).filter(
//     (v: { status: string }) => v.status === "absent"
//   ).length;
//   const halfCount = Object.values(attendanceMap).filter(
//     (v: { status: string }) => v.status === "half"
//   ).length;

//   const isCurrentMonth = currentMonth.isSame(today, "month");
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);
//   for (let d = 1; d <= totalDays; d++) {
//     if (isCurrentMonth && d > today.date()) break;
//     calendarCells.push(d);
//   }

//   /* ================= UI ================= */
//   return (
//     <View style={{ marginTop: 15 }}>
//       {/* ===== SALARY LIST ===== */}
//       <View style={styles.card}>
//         <Text style={styles.title}>Salary Details</Text>

//         <View style={styles.headerRow}>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>SERIAL NO.</Text>
//           </View>
//           <View style={styles.col}>
//             <Text style={styles.headerText}>MONTHLY</Text>
//             <Text style={styles.headerText}>SALARY RECORD</Text>
//           </View>
//           <View style={[styles.col, { alignItems: "flex-end" }]}>
//             <Text style={styles.headerText}>VIEW SALARY</Text>
//           </View>
//         </View>

//         {salaryList.length > 0 ? (
//           salaryList.map((item, index) => (
//             <View key={item.id} style={styles.dataRow}>
//               <View style={styles.col}>
//                 <Text style={styles.dataText}>{index + 1}</Text>
//               </View>
//               <View style={styles.col}>
//                 <Text style={styles.dataText}>{item.month}</Text>
//               </View>
//               <View style={[styles.col, { alignItems: "flex-end" }]}>
//                 <TouchableOpacity onPress={() => handleViewSalary(item.month)}>
//                   <Text style={styles.viewEmoji}>👁️</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))
//         ) : (
//           <View style={styles.centerBox}>
//             <Text style={styles.noData}>No salary record found</Text>
//           </View>
//         )}
//       </View>

//       {/* ===== ATTENDANCE POPUP ===== */}
//       <Modal visible={showAttendance} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity
//               style={styles.closeBtn}
//               onPress={() => setShowAttendance(false)}
//             >
//               <Text style={styles.closeText}>✕</Text>
//             </TouchableOpacity>

//             {isLoading ? (
//               <Text>Loading attendance...</Text>
//             ) : (
//               <ScrollView showsVerticalScrollIndicator={false}>
//                 <Text style={styles.title}>Attendance</Text>

//                 {/* ===== SUMMARY ROW ===== */}
//                 <View style={styles.summaryRow}>
//                   {/* LEFT: ATTENDANCE SUMMARY */}
//                   <View style={styles.summaryCard}>
//                     <Text style={styles.summaryMonth}>
//                       {currentMonth.format("MMMM")}
//                     </Text>

//                     <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//                       <Text style={styles.tagText}>
//                         PRESENT : {presentCount}
//                       </Text>
//                     </View>

//                     <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//                       <Text style={styles.tagText}>
//                         ABSENT : {absentCount}
//                       </Text>
//                     </View>

//                     <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//                       <Text style={styles.tagText}>
//                         HALF DAY : {halfCount}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* RIGHT: SALARY SUMMARY */}
//                   <View style={styles.salarySummaryCard}>
//                     <Text style={styles.salaryRow}>
//                       Monthly fixed salary:{" "}
//                       <Text style={styles.salaryValue}>
//                         {modalSalaryData?.data?.monthlySalary || salaryData?.data?.monthlySalary || "0"}
//                       </Text>
//                     </Text>
//                     <Text style={styles.salaryRow}>
//                       Total fixed salary:{" "}
//                       <Text style={styles.salaryValue}>
//                         {modalSalaryData?.data?.totalFixedSalary || salaryData?.data?.totalFixedSalary || "0"}
//                       </Text>
//                     </Text>
//                     <Text style={styles.salaryRow}>
//                       Total salary deduction:{" "}
//                       <Text style={styles.salaryValue}>
//                         {modalSalaryData?.data?.totalDeducetion || salaryData?.data?.totalDeducetion || "0"}
//                       </Text>
//                     </Text>
//                     <Text style={styles.salaryRow}>
//                       Per day salary:{" "}
//                       <Text style={styles.salaryValue}>
//                         {modalSalaryData?.data?.perdaySalary || salaryData?.data?.perdaySalary || "0"}
//                       </Text>
//                     </Text>
//                   </View>
//                 </View>

//                 {/* ===== MONTH HEADER ===== */}
//                 <View style={styles.monthHeader}>
//                   <TouchableOpacity
//                     style={styles.arrow}
//                     onPress={() =>
//                       setCurrentMonth(currentMonth.subtract(1, "month"))
//                     }
//                   >
//                     <Text style={styles.arrowText}>{"<"}</Text>
//                   </TouchableOpacity>

//                   <Text style={styles.monthTitle}>
//                     {currentMonth.format("MMMM YYYY")}
//                   </Text>

//                   <TouchableOpacity
//                     disabled={isCurrentMonth}
//                     style={[
//                       styles.arrow,
//                       isCurrentMonth && { backgroundColor: "#9CA3AF" },
//                     ]}
//                     onPress={() =>
//                       setCurrentMonth(currentMonth.add(1, "month"))
//                     }
//                   >
//                     <Text style={styles.arrowText}>{">"}</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* ===== WEEK DAYS ===== */}
//                 <View style={styles.weekRow}>
//                   {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                     <Text key={d} style={styles.weekDay}>{d}</Text>
//                   ))}
//                 </View>

//                 {/* ===== CALENDAR ===== */}
//                 <View style={styles.calendarGrid}>
//                   {calendarCells.map((day, index) => {
//                     if (!day)
//                       return <View key={index} style={styles.dayCell} />;

//                     const attendance = attendanceMap[day];
//                     const bg =
//                       attendance?.status === "present"
//                         ? "#7CDE3B"
//                         : attendance?.status === "absent"
//                         ? "#FFD5D5"
//                         : attendance?.status === "half"
//                         ? "#FFC107"
//                         : "transparent";

//                     const label =
//                       attendance?.status === "present"
//                         ? "Present"
//                         : attendance?.status === "absent"
//                         ? "Absent"
//                         : attendance?.status === "half"
//                         ? `Half Day ${attendance.interval ?? ""}`
//                         : "";

//                     return (
//                       <View
//                         key={index}
//                         style={[styles.dayCell, { backgroundColor: bg }]}
//                       >
//                         <Text style={styles.dayText}>{day}</Text>
//                         {label !== "" && (
//                           <Text style={styles.dayStatus}>{label}</Text>
//                         )}
//                       </View>
//                     );
//                   })}
//                 </View>
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default SalaryRecordTab;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },
//   headerRow: {
//     flexDirection: "row",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderColor: "#e5e5e5",
//   },
//   dataRow: {
//     flexDirection: "row",
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "#f0f0f0",
//   },
//   col: { flex: 1, justifyContent: "center" },
//   headerText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },
//   dataText: { fontSize: 14, color: "#333" },
//   viewEmoji: {
//     fontSize: 14,
//     color: "#0B4DA2",
//     fontWeight: "600",
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     margin: 10,
//     padding: 10,
//   },
//   closeBtn: { alignSelf: "flex-end" },
//   closeText: { fontSize: 18, fontWeight: "bold" },

//   summaryRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 20,
//   },
//   summaryCard: {
//     backgroundColor: "#fff",
//     width: 140,
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     elevation: 4,
//   },
//   summaryMonth: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 10,
//   },
//   tag: {
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     borderRadius: 6,
//     marginBottom: 6,
//   },
//   tagText: { fontSize: 12, fontWeight: "bold" },

//   salarySummaryCard: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     elevation: 4,
//     justifyContent: "center",
//   },
//   salaryRow: {
//     fontSize: 13,
//     color: "#374151",
//     marginBottom: 6,
//   },
//   salaryValue: {
//     fontWeight: "700",
//     color: "#111",
//   },

//   monthHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   arrow: {
//     backgroundColor: "#243447",
//     padding: 6,
//     borderRadius: 8,
//   },
//   arrowText: { color: "#fff", fontSize: 16 },
//   monthTitle: { fontSize: 18, fontWeight: "bold" },

//   weekRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   weekDay: {
//     width: "14.28%",
//     textAlign: "center",
//     fontWeight: "bold",
//     color: "#6D7A90",
//   },
//   calendarGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   dayCell: {
//     width: "14.28%",
//     paddingVertical: 8,
//     alignItems: "center",
//   },
//   dayText: { color: "#111", fontWeight: "600" },
//   dayStatus: {
//     fontSize: 8,
//     marginTop: 2,
//     fontWeight: "700",
//     color: "#111",
//   },
//   centerBox: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noData: {
//     color: "gray",
//     fontSize: 15,
//   },
// });


import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import dayjs from "dayjs";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import { COLORS } from "../../../../colors";
import { useSingleEmployeeMonthlyAttendanceQuery } from
  "../../../../apis/hooks/employee/query/useSingleEmployeeMonthlyAttendance.query";
import { useSingleSalaryQuery } from "../../../../apis/hooks/employee/query/useSingleSalary.query";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

const Heights = {
  cardHeight: Dimensions.get("window").height * 0.62,
};

const SalaryRecordTab = ({ employeeId }: { employeeId: string }) => {
  /* ================= STATE ================= */
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState<string | null>(null);

  /* ================= ATTENDANCE LOGIC ================= */
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);

  const month = currentMonth.format("MM");
  const year = currentMonth.format("YYYY");

  const { data, isLoading } =
    useSingleEmployeeMonthlyAttendanceQuery({
      employeeId,
      month,
      year,
    });

  /* ================= SALARY API CALLS ================= */
  const { data: salaryData, isLoading: isLoadingSalary } = useSingleSalaryQuery({
    employeeId,
    month,
    year,
  });

  const { data: modalSalaryData } = useSingleSalaryQuery({
    employeeId,
    month: selectedSalaryMonth ? selectedSalaryMonth.split("-")[1] : month,
    year: selectedSalaryMonth ? selectedSalaryMonth.split("-")[0] : year,
  });

  /* ================= SALARY DATA ================= */
  const salaryList = useMemo(() => {
    if (salaryData?.statuscode === 200 && salaryData?.data) {
      return [{
        id: salaryData.data.salaryId,
        month: `${year}-${month}`,
        salaryData: salaryData.data
      }];
    }
    return [];
  }, [salaryData, month, year]);

  const handleViewSalary = (monthYear: string) => {
    setSelectedSalaryMonth(monthYear);
    setShowAttendance(true);
  };

  const attendanceMap = useMemo(() => {
    const map: Record<number, { status: string; interval?: string }> = {};
    data?.data?.attendanceThisMonth?.forEach((item: any) => {
      const day = Number(item.attendanceDate.slice(6, 8));

      if (item.availablityStatus?.status === "HalfDay") {
        map[day] = { status: "half", interval: item.availablityStatus.interval };
      } else if (item.attendanceStatus === "present") {
        map[day] = { status: "present" };
      } else {
        map[day] = { status: "absent" };
      }
    });
    return map;
  }, [data]);

  const presentCount = Object.values(attendanceMap).filter(
    (v: { status: string }) => v.status === "present"
  ).length;
  const absentCount = Object.values(attendanceMap).filter(
    (v: { status: string }) => v.status === "absent"
  ).length;
  const halfCount = Object.values(attendanceMap).filter(
    (v: { status: string }) => v.status === "half"
  ).length;

  const isCurrentMonth = currentMonth.isSame(today, "month");
  const startDay = currentMonth.startOf("month").day();
  const totalDays = currentMonth.daysInMonth();

  let calendarCells = [];
  for (let i = 0; i < startDay; i++) calendarCells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    if (isCurrentMonth && d > today.date()) break;
    calendarCells.push(d);
  }

  /* ================= UI ================= */
  return (
    <View style={{ marginTop: 15 }}>
      {/* ===== SALARY LIST ===== */}
      <View style={styles.card}>
        <Text style={styles.title}>Salary Details</Text>

        <View style={styles.headerRow}>
          <View style={styles.col}>
            <Text style={styles.headerText}>SERIAL NO.</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.headerText}>MONTHLY</Text>
            <Text style={styles.headerText}>SALARY RECORD</Text>
          </View>
          <View style={[styles.col, { alignItems: "flex-end" }]}>
            <Text style={styles.headerText}>VIEW SALARY</Text>
          </View>
        </View>

        {salaryList.length > 0 ? (
          salaryList.map((item, index) => (
            <View key={item.id} style={styles.dataRow}>
              <View style={styles.col}>
                <Text style={styles.dataText}>{index + 1}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.dataText}>{item.month}</Text>
              </View>
              <View style={[styles.col, { alignItems: "flex-end" }]}>
                <TouchableOpacity onPress={() => handleViewSalary(item.month)}>
                  <Text style={styles.viewEmoji}>👁️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.centerBox}>
            <Text style={styles.noData}>No salary record found</Text>
          </View>
        )}
      </View>

      {/* ===== ATTENDANCE POPUP ===== */}
      <Modal visible={showAttendance} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowAttendance(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {isLoading ? (
              <Text>Loading attendance...</Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Attendance</Text>

                {/* ===== SUMMARY ROW ===== */}
                <View style={styles.summaryRow}>
                  {/* LEFT: ATTENDANCE SUMMARY */}
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryMonth}>
                      {currentMonth.format("MMMM")}
                    </Text>

                    <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
                      <Text style={styles.tagText}>
                        PRESENT : {presentCount}
                      </Text>
                    </View>

                    <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
                      <Text style={styles.tagText}>
                        ABSENT : {absentCount}
                      </Text>
                    </View>

                    <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
                      <Text style={styles.tagText}>
                        HALF DAY : {halfCount}
                      </Text>
                    </View>
                  </View>

                  {/* RIGHT: SALARY SUMMARY */}
                  <View style={styles.salarySummaryCard}>
                    <Text style={styles.salaryRow}>
                      Monthly fixed salary:{" "}
                      <Text style={styles.salaryValue}>
                        {modalSalaryData?.data?.monthlySalary || salaryData?.data?.monthlySalary || "0"}
                      </Text>
                    </Text>
                    <Text style={styles.salaryRow}>
                      Total fixed salary:{" "}
                      <Text style={styles.salaryValue}>
                        {modalSalaryData?.data?.totalFixedSalary || salaryData?.data?.totalFixedSalary || "0"}
                      </Text>
                    </Text>
                    <Text style={styles.salaryRow}>
                      Total salary deduction:{" "}
                      <Text style={styles.salaryValue}>
                        {modalSalaryData?.data?.totalDeducetion || salaryData?.data?.totalDeducetion || "0"}
                      </Text>
                    </Text>
                    <Text style={styles.salaryRow}>
                      Per day salary:{" "}
                      <Text style={styles.salaryValue}>
                        {modalSalaryData?.data?.perdaySalary || salaryData?.data?.perdaySalary || "0"}
                      </Text>
                    </Text>
                  </View>
                </View>

                {/* ===== MONTH HEADER ===== */}
                <View style={styles.monthHeader}>
                  <TouchableOpacity
                    style={styles.arrow}
                    onPress={() =>
                      setCurrentMonth(currentMonth.subtract(1, "month"))
                    }
                  >
                   <AutoHeightImage width={16} source={IMAGES.chevronArrowLeftIcon} />
                  </TouchableOpacity>

                  <Text style={styles.monthTitle}>
                    {currentMonth.format("MMMM YYYY")}
                  </Text>

                  <TouchableOpacity
                    disabled={isCurrentMonth}
                    style={[
                      styles.arrow,
                      isCurrentMonth && {  },
                    ]}
                    onPress={() =>
                      setCurrentMonth(currentMonth.add(1, "month"))
                    }
                  >
                   <AutoHeightImage width={16} source={IMAGES.chevronArrowRightIcon} />
                  </TouchableOpacity>
                </View>

                {/* ===== WEEK DAYS ===== */}
                <View style={styles.weekRow}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <Text key={d} style={styles.weekDay}>{d}</Text>
                  ))}
                </View>

                {/* ===== CALENDAR ===== */}
                <View style={styles.calendarGrid}>
                  {calendarCells.map((day, index) => {
                    if (!day)
                      return <View key={index} style={styles.dayCell} />;

                    const attendance = attendanceMap[day];
                    const bg =
                      attendance?.status === "present"
                        ? "#7CDE3B"
                        : attendance?.status === "absent"
                        ? "#FFD5D5"
                        : attendance?.status === "half"
                        ? "#FFC107"
                        : "transparent";

                    const label =
                      attendance?.status === "present"
                        ? "Present"
                        : attendance?.status === "absent"
                        ? "Absent"
                        : attendance?.status === "half"
                        ? `Half Day ${attendance.interval ?? ""}`
                        : "";

                    return (
                      <View
                        key={index}
                        style={[styles.dayCell, { backgroundColor: bg }]}
                      >
                        <Text style={styles.dayText}>{day}</Text>
                        {label !== "" && (
                          <Text style={styles.dayStatus}>{label}</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SalaryRecordTab;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    width: "108%",
    height: Heights.cardHeight,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 6,
    paddingTop: 18,
    paddingHorizontal: 25,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
  },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  col: { flex: 1, justifyContent: "center" },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6D7A90",
  },
  dataText: { fontSize: 14, color: "#333" },
  viewEmoji: {
    fontSize: 14,
    color: "#0B4DA2",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 10,
    padding: 10,
  },
  closeBtn: { alignSelf: "flex-end" },
  closeText: { fontSize: 18, fontWeight: "bold" },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#fff",
    width: 140,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 4,
  },
  summaryMonth: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  tagText: { fontSize: 12, fontWeight: "bold" },

  salarySummaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 4,
    justifyContent: "center",
  },
  salaryRow: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  salaryValue: {
    fontWeight: "700",
    color: "#111",
  },

  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  arrow: {
    // backgroundColor: "#243447",
    padding: 6,
    borderRadius: 8,
  },
  arrowText: { color: "#fff", fontSize: 16 },
  monthTitle: { fontSize: 18, fontWeight: "bold" },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekDay: {
    width: "14.28%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#6D7A90",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    paddingVertical: 8,
    alignItems: "center",
  },
  dayText: { color: "#111", fontWeight: "600" },
  dayStatus: {
    fontSize: 8,
    marginTop: 2,
    fontWeight: "700",
    color: "#111",
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    color: "gray",
    fontSize: 15,
  },
});
