// import React from "react";
// import { View, Text } from "react-native";
// import Center from "../../../../@ui/center/Center";

// const AttendanceTab = ({ employeeId }) => {
//   return (
//     <View style={{ padding: 15 }}>
//       <Center>
//         <Text style={{ fontSize: 16, color: "gray" }}>
//           No Attendance Found for Employee ID: {employeeId}
//         </Text>
//       </Center>
//     </View>
//   );
// };

// export default AttendanceTab;



// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { COLORS } from "../../../../colors";  // adjust path if needed

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const AttendanceTab = ({ employeeId }) => {
//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Attendance</Text>

//         <View style={styles.centerBox}>
//           <Text style={styles.noData}>No Attendance Found</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default AttendanceTab;

// const styles = StyleSheet.create({
//   card: {
//     width: "108%",
//     height: Heights.cardHeight,      // 👈 FIXED HEIGHT ADDED  
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     elevation: 6,
//     paddingTop: 18,
//     paddingHorizontal: 25,
//     borderLeftWidth: 6,
//     borderLeftColor: COLORS.primary,
//     alignSelf: "center",
//     justifyContent: "flex-start",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 15,
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


// import React, { useState } from "react";
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const AttendanceTab = ({ employeeId }) => {
//   const [currentMonth, setCurrentMonth] = useState(dayjs());

//   const MIN_YEAR = 2010;
//   const MAX_YEAR = 2050;

//   const monthName = currentMonth.format("MMMM");
//   const year = currentMonth.year();

//   const goPrev = () => {
//     const newMonth = currentMonth.subtract(1, "month");
//     if (newMonth.year() >= MIN_YEAR) setCurrentMonth(newMonth);
//   };

//   const goNext = () => {
//     const newMonth = currentMonth.add(1, "month");
//     if (newMonth.year() <= MAX_YEAR) setCurrentMonth(newMonth);
//   };

//   // Calendar days
//   const startOfMonth = currentMonth.startOf("month");
//   const startDay = startOfMonth.day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells = [];

//   for (let i = 0; i < startDay; i++) {
//     calendarCells.push({ day: "", isDate: false });
//   }

//   for (let d = 1; d <= totalDays; d++) {
//     calendarCells.push({ day: d, isDate: true });
//   }

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Attendance</Text>

//         <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>

//           {/* Summary card */}
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryMonth}>{monthName}</Text>

//             <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//               <Text style={styles.tagText}>    PRESENT : 0</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//               <Text style={styles.tagText}>    ABSENT : 0</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//               <Text style={styles.tagText}>    HALF DAY : 0</Text>
//             </View>
//           </View>

//           {/* Month Header */}
//           <View style={styles.monthHeader}>
//             <TouchableOpacity onPress={goPrev} style={styles.arrow}>
//               <Text style={styles.arrowText}>{"<"}</Text>
//             </TouchableOpacity>

//             <Text style={styles.monthTitle}>{monthName} {year}</Text>

//             <TouchableOpacity onPress={goNext} style={styles.arrow}>
//               <Text style={styles.arrowText}>{">"}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Week Days */}
//           <View style={styles.weekRow}>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <Text key={d} style={styles.weekDay}>{d}</Text>
//             ))}
//           </View>

//           {/* Calendar Grid */}
//           <View style={styles.calendarGrid}>
//             {calendarCells.map((item, index) => (
//               <View key={index} style={styles.dayCell}>
//                 <Text style={styles.dayText}>{item.day}</Text>
//               </View>
//             ))}
//           </View>

//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default AttendanceTab;

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

//   summaryCard: {
//     backgroundColor: "#fff",
//     width: 140,
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 20,
//     elevation: 3,
//   },

//   summaryMonth: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 8,
//     color: "#333",
//   },

//   tag: {
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginBottom: 6,
//   },

//   tagText: {
//     fontWeight: "bold",
//     fontSize: 12,
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
//     color: "#000",
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
//     paddingVertical: 15,
//     alignItems: "center",
//   },

//   dayText: {
//     color: "#333",
//   },
// });


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// // dummy attendance data (API se aayega baad me)
// const attendanceData: Record<number, "present" | "absent" | "half"> = {
//   2: "present",
//   3: "absent",
//   6: "half",
//   10: "present",
//   14: "absent",
// };

// const AttendanceTab = ({ employeeId }) => {
//   const [currentMonth, setCurrentMonth] = useState(dayjs());

//   const MIN_YEAR = 2010;
//   const MAX_YEAR = 2050;

//   const monthName = currentMonth.format("MMMM");
//   const year = currentMonth.year();

//   const goPrev = () => {
//     const m = currentMonth.subtract(1, "month");
//     if (m.year() >= MIN_YEAR) setCurrentMonth(m);
//   };

//   const goNext = () => {
//     const m = currentMonth.add(1, "month");
//     if (m.year() <= MAX_YEAR) setCurrentMonth(m);
//   };

//   // summary counts
//   const presentCount = Object.values(attendanceData).filter(
//     (v) => v === "present"
//   ).length;
//   const absentCount = Object.values(attendanceData).filter(
//     (v) => v === "absent"
//   ).length;
//   const halfCount = Object.values(attendanceData).filter(
//     (v) => v === "half"
//   ).length;

//   // calendar
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells: (number | null)[] = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);
//   for (let d = 1; d <= totalDays; d++) calendarCells.push(d);

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Attendance</Text>

//         <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
//           {/* SUMMARY */}
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryMonth}>{monthName}</Text>

//             <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//               <Text style={styles.tagText}>  PRESENT : {presentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//               <Text style={styles.tagText}>  ABSENT : {absentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//               <Text style={styles.tagText}>  HALF DAY : {halfCount}</Text>
//             </View>
//           </View>

//           {/* MONTH HEADER */}
//           <View style={styles.monthHeader}>
//             <TouchableOpacity onPress={goPrev} style={styles.arrow}>
//               <Text style={styles.arrowText}>{"<"}</Text>
//             </TouchableOpacity>

//             <Text style={styles.monthTitle}>
//               {monthName} {year}
//             </Text>

//             <TouchableOpacity onPress={goNext} style={styles.arrow}>
//               <Text style={styles.arrowText}>{">"}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* WEEK DAYS */}
//           <View style={styles.weekRow}>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <Text key={d} style={styles.weekDay}>
//                 {d}
//               </Text>
//             ))}
//           </View>

//           {/* CALENDAR GRID */}
//           <View style={styles.calendarGrid}>
//             {calendarCells.map((day, index) => {
//               if (!day) return <View key={index} style={styles.dayCell} />;

//               const status = attendanceData[day];
//               const bg =
//                 status === "present"
//                   ? "#d7ffd9"
//                   : status === "absent"
//                   ? "#ffd7d7"
//                   : status === "half"
//                   ? "#ffe6b0"
//                   : "transparent";

//               return (
//                 <View key={index} style={[styles.dayCell, { backgroundColor: bg }]}>
//                   <Text style={styles.dayText}>{day}</Text>
//                 </View>
//               );
//             })}
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default AttendanceTab;

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

//   summaryCard: {
//     backgroundColor: "#ffffff",
//   width: 140,
//   borderRadius: 12,
//   padding: 12,
//   marginBottom: 20,

//   // ⭐ BORDER (main fix)
//   borderWidth: 1,
//   borderColor: "#E2E8F0",

//   // ⭐ SHADOW (iOS)
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.15,
//   shadowRadius: 4,

//   // ⭐ ANDROID
//   elevation: 4,
//   },

//   summaryMonth: {
//     fontSize: 16,
//   fontWeight: "700",
//   marginBottom: 10,
//   color: "#1F2937",
//   },

//   tag: {
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginBottom: 6,
//   },

//   tagText: {
//     fontWeight: "bold",
//     fontSize: 12,
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
//     paddingVertical: 14,
//     alignItems: "center",
//   },

//   dayText: {
//     color: "#333",
//   },
// });


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// // dummy attendance data (API se aayega baad me)
// const attendanceData: Record<number, "present" | "absent" | "half"> = {
//   2: "present",
//   3: "absent",
//   6: "half",
//   10: "present",
//   14: "absent",
// };

// const AttendanceTab = ({ employeeId }) => {
//   const [currentMonth, setCurrentMonth] = useState(dayjs());

//   const MIN_YEAR = 2010;
//   const MAX_YEAR = 2050;

//   const monthName = currentMonth.format("MMMM");
//   const year = currentMonth.year();

//   const goPrev = () => {
//     const m = currentMonth.subtract(1, "month");
//     if (m.year() >= MIN_YEAR) setCurrentMonth(m);
//   };

//   const goNext = () => {
//     const m = currentMonth.add(1, "month");
//     if (m.year() <= MAX_YEAR) setCurrentMonth(m);
//   };

//   // summary counts
//   const presentCount = Object.values(attendanceData).filter(
//     (v) => v === "present"
//   ).length;
//   const absentCount = Object.values(attendanceData).filter(
//     (v) => v === "absent"
//   ).length;
//   const halfCount = Object.values(attendanceData).filter(
//     (v) => v === "half"
//   ).length;

//   // calendar
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells: (number | null)[] = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);
//   for (let d = 1; d <= totalDays; d++) calendarCells.push(d);

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Attendance</Text>

//         <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
//           {/* SUMMARY */}
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryMonth}>{monthName}</Text>

//             <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//               <Text style={styles.tagText}>  PRESENT : {presentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//               <Text style={styles.tagText}>  ABSENT : {absentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//               <Text style={styles.tagText}>  HALF DAY : {halfCount}</Text>
//             </View>
//           </View>

//           {/* MONTH HEADER */}
//           <View style={styles.monthHeader}>
//             <TouchableOpacity onPress={goPrev} style={styles.arrow}>
//               <Text style={styles.arrowText}>{"<"}</Text>
//             </TouchableOpacity>

//             <Text style={styles.monthTitle}>
//               {monthName} {year}
//             </Text>

//             <TouchableOpacity onPress={goNext} style={styles.arrow}>
//               <Text style={styles.arrowText}>{">"}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* WEEK DAYS */}
//           <View style={styles.weekRow}>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <Text key={d} style={styles.weekDay}>
//                 {d}
//               </Text>
//             ))}
//           </View>

//          {/* CALENDAR GRID */}
// <View style={styles.calendarGrid}>
//   {calendarCells.map((day, index) => {
//     if (!day) return <View key={index} style={styles.dayCell} />;

//     const status = attendanceData[day];

//     const bg =
//       status === "present"
//         ? "#d7ffd9"
//         : status === "absent"
//         ? "#ffd7d7"
//         : status === "half"
//         ? "#ffe6b0"
//         : "transparent";

//     const label =
//       status === "present"
//         ? "Present"
//         : status === "absent"
//         ? "Absent"
//         : status === "half"
//         ? "Half Day 2"
//         : "";

//     return (
//       <View key={index} style={[styles.dayCell, { backgroundColor: bg }]}>
//         {/* Date */}
//         <Text style={styles.dayText}>{day}</Text>

//         {/* Status under date */}
//         {label !== "" && (
//           <Text style={styles.dayStatus}>{label}</Text>
//         )}
//       </View>
//     );
//   })}
// </View>

//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default AttendanceTab;

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

//   summaryCard: {
//     backgroundColor: "#ffffff",
//   width: 140,
//   borderRadius: 12,
//   padding: 12,
//   marginBottom: 20,

//   // ⭐ BORDER (main fix)
//   borderWidth: 1,
//   borderColor: "#E2E8F0",

//   // ⭐ SHADOW (iOS)
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.15,
//   shadowRadius: 4,

//   // ⭐ ANDROID
//   elevation: 4,
//   },

//   summaryMonth: {
//     fontSize: 16,
//   fontWeight: "700",
//   marginBottom: 10,
//   color: "#1F2937",
//   },

//   tag: {
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginBottom: 6,
//   },

//   tagText: {
//     fontWeight: "bold",
//     fontSize: 12,
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
//     color: "#333",
//   },
//   dayStatus: {
//     fontSize: 8,
//     color: "#374151",
//     marginTop: 2,
//     fontWeight: "600",
//   },
  
// });



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// // dummy attendance data
// const attendanceData: Record<number, "present" | "absent" | "half"> = {
//   2: "present",
//   3: "absent",
//   6: "half",
//   10: "present",
//   14: "absent",
// };

// const AttendanceTab = ({ employeeId }) => {
//   const today = dayjs();

//   // ✅ AUTO CURRENT MONTH (month end ke baad next month aa jayega)
//   const [currentMonth, setCurrentMonth] = useState(
//     today.isSame(today.endOf("month"), "day")
//       ? today.add(1, "month")
//       : today
//   );

//   const monthName = currentMonth.format("MMMM");
//   const year = currentMonth.year();

//   const isCurrentMonth = currentMonth.isSame(today, "month");

//   const goPrev = () => {
//     setCurrentMonth(currentMonth.subtract(1, "month"));
//   };

//   // ❌ future month me nahi ja sakte
//   const goNext = () => {
//     if (!isCurrentMonth) {
//       setCurrentMonth(currentMonth.add(1, "month"));
//     }
//   };

//   // calendar logic
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells: (number | null)[] = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);

//   for (let d = 1; d <= totalDays; d++) {
//     // ✅ current month me future dates hide
//     if (isCurrentMonth && d > today.date()) break;
//     calendarCells.push(d);
//   }

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Attendance</Text>

//         <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
//           {/* MONTH HEADER */}
//           <View style={styles.monthHeader}>
//             <TouchableOpacity onPress={goPrev} style={styles.arrow}>
//               <Text style={styles.arrowText}>{"<"}</Text>
//             </TouchableOpacity>

//             <Text style={styles.monthTitle}>
//               {monthName} {year}
//             </Text>

//             <TouchableOpacity
//               onPress={goNext}
//               style={[
//                 styles.arrow,
//                 isCurrentMonth && { backgroundColor: "#9CA3AF" },
//               ]}
//               disabled={isCurrentMonth}
//             >
//               <Text style={styles.arrowText}>{">"}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* WEEK DAYS */}
//           <View style={styles.weekRow}>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <Text key={d} style={styles.weekDay}>
//                 {d}
//               </Text>
//             ))}
//           </View>

//           {/* CALENDAR */}
//           <View style={styles.calendarGrid}>
//             {calendarCells.map((day, index) => {
//               if (!day) return <View key={index} style={styles.dayCell} />;

//               const status = attendanceData[day];
//               const bg =
//                 status === "present"
//                   ? "#d7ffd9"
//                   : status === "absent"
//                   ? "#ffd7d7"
//                   : status === "half"
//                   ? "#ffe6b0"
//                   : "transparent";

//               const label =
//                 status === "present"
//                   ? "Present"
//                   : status === "absent"
//                   ? "Absent"
//                   : status === "half"
//                   ? "Half Day 2"
//                   : "";

//               return (
//                 <View
//                   key={index}
//                   style={[styles.dayCell, { backgroundColor: bg }]}
//                 >
//                   <Text style={styles.dayText}>{day}</Text>
//                   {label !== "" && (
//                     <Text style={styles.dayStatus}>{label}</Text>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default AttendanceTab;

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
//     color: "#333",
//   },

//   dayStatus: {
//     fontSize: 8,
//     color: "#374151",
//     marginTop: 2,
//     fontWeight: "600",
//   },
// });



// ye sahi he 
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// // dummy attendance data
// const attendanceData: Record<number, "present" | "absent" | "half"> = {
//   2: "present",
//   3: "absent",
//   6: "half",
//   10: "present",
//   14: "absent",
// };

// const AttendanceTab = ({ employeeId }) => {
//   const today = dayjs();
//   const [currentMonth, setCurrentMonth] = useState(today);

//   const monthName = currentMonth.format("MMMM");
//   const year = currentMonth.year();
//   const isCurrentMonth = currentMonth.isSame(today, "month");

//   const goPrev = () => {
//     setCurrentMonth(currentMonth.subtract(1, "month"));
//   };

//   const goNext = () => {
//     if (!isCurrentMonth) {
//       setCurrentMonth(currentMonth.add(1, "month"));
//     }
//   };

//   // ✅ SUMMARY COUNTS
//   const presentCount = Object.values(attendanceData).filter(
//     (v) => v === "present"
//   ).length;

//   const absentCount = Object.values(attendanceData).filter(
//     (v) => v === "absent"
//   ).length;

//   const halfCount = Object.values(attendanceData).filter(
//     (v) => v === "half"
//   ).length;

//   // calendar logic
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells: (number | null)[] = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);

//   for (let d = 1; d <= totalDays; d++) {
//     if (isCurrentMonth && d > today.date()) break;
//     calendarCells.push(d);
//   }

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Attendance</Text>

//         <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>

//           {/* ===== SUMMARY BLOCK ===== */}
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryMonth}>{monthName}</Text>

//             <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//               <Text style={styles.tagText}>PRESENT : {presentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//               <Text style={styles.tagText}>ABSENT : {absentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//               <Text style={styles.tagText}>HALF DAY : {halfCount}</Text>
//             </View>
//           </View>

//           {/* MONTH HEADER */}
//           <View style={styles.monthHeader}>
//             <TouchableOpacity onPress={goPrev} style={styles.arrow}>
//               <Text style={styles.arrowText}>{"<"}</Text>
//             </TouchableOpacity>

//             <Text style={styles.monthTitle}>
//               {monthName} {year}
//             </Text>

//             <TouchableOpacity
//               onPress={goNext}
//               style={[
//                 styles.arrow,
//                 isCurrentMonth && { backgroundColor: "#9CA3AF" },
//               ]}
//               disabled={isCurrentMonth}
//             >
//               <Text style={styles.arrowText}>{">"}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* WEEK DAYS */}
//           <View style={styles.weekRow}>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <Text key={d} style={styles.weekDay}>
//                 {d}
//               </Text>
//             ))}
//           </View>

//           {/* CALENDAR */}
//           <View style={styles.calendarGrid}>
//             {calendarCells.map((day, index) => {
//               if (!day) return <View key={index} style={styles.dayCell} />;

//               const status = attendanceData[day];
//               const bg =
//                 status === "present"
//                   ? "#d7ffd9"
//                   : status === "absent"
//                   ? "#ffd7d7"
//                   : status === "half"
//                   ? "#ffe6b0"
//                   : "transparent";

//               const label =
//                 status === "present"
//                   ? "Present"
//                   : status === "absent"
//                   ? "Absent"
//                   : status === "half"
//                   ? "Half Day"
//                   : "";

//               return (
//                 <View
//                   key={index}
//                   style={[styles.dayCell, { backgroundColor: bg }]}
//                 >
//                   <Text style={styles.dayText}>{day}</Text>
//                   {label !== "" && (
//                     <Text style={styles.dayStatus}>{label}</Text>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default AttendanceTab;

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

//   /* SUMMARY BLOCK */
//   summaryCard: {
//     backgroundColor: "#ffffff",
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
//     color: "#1F2937",
//   },

//   tag: {
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     borderRadius: 6,
//     marginBottom: 6,
//   },

//   tagText: {
//     fontWeight: "bold",
//     fontSize: 12,
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
//     color: "#333",
//   },

//   dayStatus: {
//     fontSize: 8,
//     color: "#374151",
//     marginTop: 2,
//     fontWeight: "600",
//   },
// });


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// // dummy attendance data
// const attendanceData: Record<number, "present" | "absent" | "half"> = {
//   2: "present",
//   3: "absent",
//   6: "half",
//   10: "present",
//   14: "absent",
// };

// const AttendanceTab = ({ employeeId }) => {
//   const today = dayjs();
//   const [currentMonth, setCurrentMonth] = useState(today);

//   const monthName = currentMonth.format("MMMM");
//   const year = currentMonth.year();
//   const isCurrentMonth = currentMonth.isSame(today, "month");

//   const goPrev = () => {
//     setCurrentMonth(currentMonth.subtract(1, "month"));
//   };

//   const goNext = () => {
//     if (!isCurrentMonth) {
//       setCurrentMonth(currentMonth.add(1, "month"));
//     }
//   };

//   // ✅ SUMMARY COUNTS
//   const presentCount = Object.values(attendanceData).filter(
//     (v) => v === "present"
//   ).length;

//   const absentCount = Object.values(attendanceData).filter(
//     (v) => v === "absent"
//   ).length;

//   const halfCount = Object.values(attendanceData).filter(
//     (v) => v === "half"
//   ).length;

//   // calendar logic
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells: (number | null)[] = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);

//   for (let d = 1; d <= totalDays; d++) {
//     if (isCurrentMonth && d > today.date()) break;
//     calendarCells.push(d);
//   }

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Attendance</Text>

//         <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>

//           {/* ===== SUMMARY BLOCK ===== */}
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryMonth}>{monthName}</Text>

//             <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//               <Text style={styles.tagText}>PRESENT : {presentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//               <Text style={styles.tagText}>ABSENT : {absentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//               <Text style={styles.tagText}>HALF DAY : {halfCount}</Text>
//             </View>
//           </View>

//           {/* MONTH HEADER */}
//           <View style={styles.monthHeader}>
//             <TouchableOpacity onPress={goPrev} style={styles.arrow}>
//               <Text style={styles.arrowText}>{"<"}</Text>
//             </TouchableOpacity>

//             <Text style={styles.monthTitle}>
//               {monthName} {year}
//             </Text>

//             <TouchableOpacity
//               onPress={goNext}
//               style={[
//                 styles.arrow,
//                 isCurrentMonth && { backgroundColor: "#9CA3AF" },
//               ]}
//               disabled={isCurrentMonth}
//             >
//               <Text style={styles.arrowText}>{">"}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* WEEK DAYS */}
//           <View style={styles.weekRow}>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <Text key={d} style={styles.weekDay}>
//                 {d}
//               </Text>
//             ))}
//           </View>

//           {/* CALENDAR */}
//           <View style={styles.calendarGrid}>
//             {calendarCells.map((day, index) => {
//               if (!day) return <View key={index} style={styles.dayCell} />;

//               const status = attendanceData[day];
//               const bg =
//                 status === "present"
//                   ? "#d7ffd9"
//                   : status === "absent"
//                   ? "#ffd7d7"
//                   : status === "half"
//                   ? "#ffe6b0"
//                   : "transparent";

//               const label =
//                 status === "present"
//                   ? "Present"
//                   : status === "absent"
//                   ? "Absent"
//                   : status === "half"
//                   ? "Half Day"
//                   : "";

//               return (
//                 <View
//                   key={index}
//                   style={[styles.dayCell, { backgroundColor: bg }]}
//                 >
//                   <Text style={styles.dayText}>{day}</Text>
//                   {label !== "" && (
//                     <Text style={styles.dayStatus}>{label}</Text>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default AttendanceTab;

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

//   /* SUMMARY BLOCK */
//   summaryCard: {
//     backgroundColor: "#ffffff",
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
//     color: "#1F2937",
//   },

//   tag: {
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     borderRadius: 6,
//     marginBottom: 6,
//   },

//   tagText: {
//     fontWeight: "bold",
//     fontSize: 12,
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
//     color: "#333",
//   },

//   dayStatus: {
//     fontSize: 8,
//     color: "#374151",
//     marginTop: 2,
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
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";
// import { useSingleEmployeeMonthlyAttendanceQuery } from "D:/Projects/Karomanage-mobile-android-app/src/apis/hooks/employee/query/useSingleEmployeeMonthlyAttendance.query";
// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// const AttendanceTab = ({ employeeId }) => {
//   const today = dayjs();
//   const [currentMonth, setCurrentMonth] = useState(today);

//   const monthName = currentMonth.format("MMMM");
//   const year = currentMonth.year();
//   const isCurrentMonth = currentMonth.isSame(today, "month");

//   /* ================= API CALL ================= */
//   const { data, isLoading } =
//     useSingleEmployeeMonthlyAttendanceQuery(employeeId);

//   const attendanceList =
//     data?.statusCode === 200 ? data?.data?.attendanceThisMonth || [] : [];

//   /* ================= MAP API → DAY OBJECT ================= */
//   const attendanceData = useMemo(() => {
//     const map: Record<number, "present" | "absent" | "half"> = {};

//     attendanceList.forEach((item) => {
//       const day = Number(item.attendanceDate.slice(6, 8));

//       if (item.availablityStatus?.status === "HalfDay") {
//         map[day] = "half";
//       } else if (item.attendanceStatus === "present") {
//         map[day] = "present";
//       } else {
//         map[day] = "absent";
//       }
//     });

//     return map;
//   }, [attendanceList]);

//   /* ================= SUMMARY COUNTS ================= */
//   const presentCount = Object.values(attendanceData).filter(
//     (v) => v === "present"
//   ).length;

//   const absentCount = Object.values(attendanceData).filter(
//     (v) => v === "absent"
//   ).length;

//   const halfCount = Object.values(attendanceData).filter(
//     (v) => v === "half"
//   ).length;

//   /* ================= MONTH NAV ================= */
//   const goPrev = () => {
//     setCurrentMonth(currentMonth.subtract(1, "month"));
//   };

//   const goNext = () => {
//     if (!isCurrentMonth) {
//       setCurrentMonth(currentMonth.add(1, "month"));
//     }
//   };

//   /* ================= CALENDAR ================= */
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells: (number | null)[] = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);

//   for (let d = 1; d <= totalDays; d++) {
//     if (isCurrentMonth && d > today.date()) break;
//     calendarCells.push(d);
//   }

//   if (isLoading) {
//     return (
//       <View style={{ marginTop: 15 }}>
//         <View style={styles.card}>
//           <Text>Loading attendance...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Attendance</Text>

//         <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
//           {/* ===== SUMMARY BLOCK ===== */}
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryMonth}>{monthName}</Text>

//             <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//               <Text style={styles.tagText}>PRESENT : {presentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//               <Text style={styles.tagText}>ABSENT : {absentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//               <Text style={styles.tagText}>HALF DAY : {halfCount}</Text>
//             </View>
//           </View>

//           {/* MONTH HEADER */}
//           <View style={styles.monthHeader}>
//             <TouchableOpacity onPress={goPrev} style={styles.arrow}>
//               <Text style={styles.arrowText}>{"<"}</Text>
//             </TouchableOpacity>

//             <Text style={styles.monthTitle}>
//               {monthName} {year}
//             </Text>

//             <TouchableOpacity
//               onPress={goNext}
//               style={[
//                 styles.arrow,
//                 isCurrentMonth && { backgroundColor: "#9CA3AF" },
//               ]}
//               disabled={isCurrentMonth}
//             >
//               <Text style={styles.arrowText}>{">"}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* WEEK DAYS */}
//           <View style={styles.weekRow}>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <Text key={d} style={styles.weekDay}>
//                 {d}
//               </Text>
//             ))}
//           </View>

//           {/* CALENDAR */}
//           <View style={styles.calendarGrid}>
//             {calendarCells.map((day, index) => {
//               if (!day) return <View key={index} style={styles.dayCell} />;

//               const status = attendanceData[day];
//               const bg =
//                 status === "present"
//                   ? "#d7ffd9"
//                   : status === "absent"
//                   ? "#ffd7d7"
//                   : status === "half"
//                   ? "#ffe6b0"
//                   : "transparent";

//               const label =
//                 status === "present"
//                   ? "Present"
//                   : status === "absent"
//                   ? "Absent"
//                   : status === "half"
//                   ? "Half Day 2"
//                   : "";

//               return (
//                 <View
//                   key={index}
//                   style={[styles.dayCell, { backgroundColor: bg }]}
//                 >
//                   <Text style={styles.dayText}>{day}</Text>
//                   {label !== "" && (
//                     <Text style={styles.dayStatus}>{label}</Text>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default AttendanceTab;

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

//   summaryCard: {
//     backgroundColor: "#ffffff",
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
//     color: "#1F2937",
//   },

//   tag: {
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     borderRadius: 6,
//     marginBottom: 6,
//   },

//   tagText: {
//     fontWeight: "bold",
//     fontSize: 12,
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
//     color: "#333",
//   },

//   dayStatus: {
//     fontSize: 8,
//     color: "#374151",
//     marginTop: 2,
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
// } from "react-native";
// import dayjs from "dayjs";
// import { COLORS } from "../../../../colors";
// import { useSingleEmployeeMonthlyAttendanceQuery } from "D:/Projects/Karomanage-mobile-android-app/src/apis/hooks/employee/query/useSingleEmployeeMonthlyAttendance.query";

// const Heights = {
//   cardHeight: Dimensions.get("window").height * 0.62,
// };

// type AttendanceType = "present" | "absent" | "half";

// const AttendanceTab = ({ employeeId }) => {
//   const today = dayjs();
//   const [currentMonth, setCurrentMonth] = useState(today);

//   const month = currentMonth.format("MM");
//   const year = currentMonth.format("YYYY");

//   // ✅ API CALL
//   const { data, isLoading } =
//     useSingleEmployeeMonthlyAttendanceQuery({
//       employeeId,
//       month,
//       year,
//     });

//   // ===============================
//   // ✅ API → MAP (date → status)
//   // ===============================
//   const attendanceMap: Record<number, AttendanceType> = useMemo(() => {
//     const map: Record<number, AttendanceType> = {};

//     data?.data?.attendanceThisMonth?.forEach((item) => {
//       const day = dayjs(item.attendanceDate, "YYYYMMDD").date();

//       if (item.availablityStatus?.status === "HalfDay") {
//         map[day] = "half";
//       } else if (item.attendanceStatus === "present") {
//         map[day] = "present";
//       } else {
//         map[day] = "absent";
//       }
//     });

//     return map;
//   }, [data]);

//   // ===============================
//   // ✅ SUMMARY COUNTS
//   // ===============================
//   const presentCount = Object.values(attendanceMap).filter(
//     (v) => v === "present"
//   ).length;

//   const absentCount = Object.values(attendanceMap).filter(
//     (v) => v === "absent"
//   ).length;

//   const halfCount = Object.values(attendanceMap).filter(
//     (v) => v === "half"
//   ).length;

//   // ===============================
//   // CALENDAR BUILD
//   // ===============================
//   const isCurrentMonth = currentMonth.isSame(today, "month");
//   const startDay = currentMonth.startOf("month").day();
//   const totalDays = currentMonth.daysInMonth();

//   let calendarCells: (number | null)[] = [];
//   for (let i = 0; i < startDay; i++) calendarCells.push(null);

//   for (let d = 1; d <= totalDays; d++) {
//     if (isCurrentMonth && d > today.date()) break;
//     calendarCells.push(d);
//   }

//   if (isLoading) {
//     return (
//       <View style={{ marginTop: 15 }}>
//         <View style={styles.card}>
//           <Text>Loading attendance...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ marginTop: 15 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Attendance</Text>

//         <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
//           {/* ===== SUMMARY BLOCK ===== */}
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryMonth}>
//               {currentMonth.format("MMMM")}
//             </Text>

//             <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
//               <Text style={styles.tagText}>PRESENT : {presentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
//               <Text style={styles.tagText}>ABSENT : {absentCount}</Text>
//             </View>

//             <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
//               <Text style={styles.tagText}>HALF DAY : {halfCount}</Text>
//             </View>
//           </View>

//           {/* ===== MONTH HEADER ===== */}
//           <View style={styles.monthHeader}>
//             <TouchableOpacity
//               onPress={() =>
//                 setCurrentMonth(currentMonth.subtract(1, "month"))
//               }
//               style={styles.arrow}
//             >
//               <Text style={styles.arrowText}>{"<"}</Text>
//             </TouchableOpacity>

//             <Text style={styles.monthTitle}>
//               {currentMonth.format("MMMM YYYY")}
//             </Text>

//             <TouchableOpacity
//               disabled={isCurrentMonth}
//               onPress={() =>
//                 setCurrentMonth(currentMonth.add(1, "month"))
//               }
//               style={[
//                 styles.arrow,
//                 isCurrentMonth && { backgroundColor: "#9CA3AF" },
//               ]}
//             >
//               <Text style={styles.arrowText}>{">"}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* ===== WEEK DAYS ===== */}
//           <View style={styles.weekRow}>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <Text key={d} style={styles.weekDay}>
//                 {d}
//               </Text>
//             ))}
//           </View>

//           {/* ===== CALENDAR ===== */}
//           <View style={styles.calendarGrid}>
//             {calendarCells.map((day, index) => {
//               if (!day) return <View key={index} style={styles.dayCell} />;

//               const status = attendanceMap[day];

//               const bg =
//                 status === "present"
//                   ? "#7CDE3B"
//                   : status === "absent"
//                   ? "#FFD5D5"
//                   : status === "half"
//                   ? "#FFC107"
//                   : "transparent";

//               const label =
//                 status === "present"
//                   ? "Present"
//                   : status === "absent"
//                   ? "Absent"
//                   : status === "half"
//                   ? "Half Day"
//                   : "";

//               return (
//                 <View
//                   key={index}
//                   style={[styles.dayCell, { backgroundColor: bg }]}
//                 >
//                   <Text style={styles.dayText}>{day}</Text>
//                   {label !== "" && (
//                     <Text style={styles.dayStatus}>{label}</Text>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default AttendanceTab;

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

//   /* SUMMARY */
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

//   /* HEADER */
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

//   /* CALENDAR */
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


import React, { useMemo, useState } from "react";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import dayjs from "dayjs";
import { COLORS } from "../../../../colors";
import { useSingleEmployeeMonthlyAttendanceQuery } from "../../../../apis/hooks/employee/query/useSingleEmployeeMonthlyAttendance.query";

const Heights = {
  cardHeight: Dimensions.get("window").height * 0.62,
};

type AttendanceEntry = {
  status: "present" | "absent" | "half";
  interval?: string;
};

const AttendanceTab = ({ employeeId }) => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);

  const month = currentMonth.format("MM");
  const year = currentMonth.format("YYYY");

  // 🔹 API CALL
  const { data, isLoading } =
    useSingleEmployeeMonthlyAttendanceQuery({
      employeeId,
      month,
      year,
    });

  // ===============================
  // 🔹 API → MAP (day → status + interval)
  // ===============================
  const attendanceMap: Record<number, AttendanceEntry> = useMemo(() => {
    const map: Record<number, AttendanceEntry> = {};

    data?.data?.attendanceThisMonth?.forEach((item) => {
      const day = Number(item.attendanceDate.slice(6, 8));

      if (item.availablityStatus?.status === "HalfDay") {
        map[day] = {
          status: "half",
          interval: item.availablityStatus.interval, // "1" | "2"
        };
      } else if (item.attendanceStatus === "present") {
        map[day] = { status: "present" };
      } else {
        map[day] = { status: "absent" };
      }
    });

    return map;
  }, [data]);

  // ===============================
  // 🔹 SUMMARY COUNTS
  // ===============================
  const presentCount = Object.values(attendanceMap).filter(
    (v) => v.status === "present"
  ).length;

  const absentCount = Object.values(attendanceMap).filter(
    (v) => v.status === "absent"
  ).length;

  const halfCount = Object.values(attendanceMap).filter(
    (v) => v.status === "half"
  ).length;

  // ===============================
  // 🔹 CALENDAR BUILD
  // ===============================
  const isCurrentMonth = currentMonth.isSame(today, "month");
  const startDay = currentMonth.startOf("month").day();
  const totalDays = currentMonth.daysInMonth();

  let calendarCells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) calendarCells.push(null);

  for (let d = 1; d <= totalDays; d++) {
    if (isCurrentMonth && d > today.date()) break;
    calendarCells.push(d);
  }

  if (isLoading) {
    return (
      <View style={{ marginTop: 15 }}>
        <View style={styles.card}>
          <Text>Loading attendance...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 15 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Attendance</Text>

        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {/* ===== SUMMARY BLOCK ===== */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryMonth}>
              {currentMonth.format("MMMM")}
            </Text>

            <View style={[styles.tag, { backgroundColor: "#d7ffd9" }]}>
              <Text style={styles.tagText}>PRESENT : {presentCount}</Text>
            </View>

            <View style={[styles.tag, { backgroundColor: "#ffd7d7" }]}>
              <Text style={styles.tagText}>ABSENT : {absentCount}</Text>
            </View>

            <View style={[styles.tag, { backgroundColor: "#ffe6b0" }]}>
              <Text style={styles.tagText}>HALF DAY : {halfCount}</Text>
            </View>
          </View>

          {/* ===== MONTH HEADER ===== */}
          <View style={styles.monthHeader}>
            <TouchableOpacity
              onPress={() =>
                setCurrentMonth(currentMonth.subtract(1, "month"))
              }
              style={styles.arrow}
            >
            <AutoHeightImage width={16} source={IMAGES.chevronArrowLeftIcon} />
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {currentMonth.format("MMMM YYYY")}
            </Text>

            <TouchableOpacity
              disabled={isCurrentMonth}
              onPress={() =>
                setCurrentMonth(currentMonth.add(1, "month"))
              }
              style={[
                styles.arrow,
                isCurrentMonth && {  },
              ]}
            >
              <AutoHeightImage width={16} source={IMAGES.chevronArrowRightIcon} />
            </TouchableOpacity>
          </View>

          {/* ===== WEEK DAYS ===== */}
          <View style={styles.weekRow}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <Text key={d} style={styles.weekDay}>
                {d}
              </Text>
            ))}
          </View>

          {/* ===== CALENDAR ===== */}
          <View style={styles.calendarGrid}>
            {calendarCells.map((day, index) => {
              if (!day) return <View key={index} style={styles.dayCell} />;

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
      </View>
    </View>
  );
};

export default AttendanceTab;

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
    color: "#000000"   // Pure Black
,
  },

  summaryCard: {
    backgroundColor: "#fff",
    width: 140,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
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

  tagText: {
    fontSize: 12,
    fontWeight: "bold",
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

  arrowText: {
    color: "#fff",
    fontSize: 16,
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

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

  dayText: {
    color: "#111",
    fontWeight: "600",
  },

  dayStatus: {
    fontSize: 8,
    marginTop: 2,
    fontWeight: "700",
    color: "#111",
  },
});
