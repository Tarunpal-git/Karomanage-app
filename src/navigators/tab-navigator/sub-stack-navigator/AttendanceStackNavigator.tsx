import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AttendanceCalendar from "../../../screens/attendance/attendance-calendar";
import EmployeeAttendance from "../../../screens/attendance/employe-attendance";
import StudentBatchList from "../../../screens/attendance/student-batch-list";
import StudentAttendance from "../../../screens/attendance/student-attendance";

type TAttendanceStackNavigatorParams = {
  AttendanceCalendar: undefined;
  EmployeeAttendance: undefined;
  StudentBatchList: undefined;
  StudentAttendance: {
    batchId: string;
  };
};
const AttendanceStackNavigator = () => {
  const Stack = createNativeStackNavigator<TAttendanceStackNavigatorParams>();
  
  return (
    <Stack.Navigator
      initialRouteName="AttendanceCalendar"
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Stack.Screen name="AttendanceCalendar" component={AttendanceCalendar} />
      <Stack.Screen name="EmployeeAttendance" component={EmployeeAttendance} />
      <Stack.Screen name="StudentBatchList" component={StudentBatchList} />
      <Stack.Screen name="StudentAttendance" component={StudentAttendance} />
    </Stack.Navigator>
  );
};

export default AttendanceStackNavigator;



// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Alert,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import SafeView from "../../../@ui/safe-view/SafeView";
// import AppHeader from "../../../@ui/app-header/AppHeader";
// import Button from "../../../@ui/button/Button";
// import { Calendar } from "react-native-calendars";
// import { COLORS } from "../../../colors";
// import { store } from "../../../app/store";
// import moment from "moment";
// import { useUpdateSelfAttendance } from "../../../apis/hooks/attendance/mutation/Updateselfattendance";
// import { useMarkLectureAttendance } from "../../../apis/hooks/attendance/mutation/useMarkLectureAttendance";
// import { useNavigation } from "@react-navigation/native";

// const AttendanceStackNavigator = ({ route }) => {
//   const { lectureId } = route.params || {}; // Extract lectureId from route params
//   const [showPopup, setShowPopup] = useState(false); // State to show lecture attendance popup
//   const [selectedDate, setSelectedDate] = useState(moment()); // State for the calendar's selected date
//   const [markedDates, setMarkedDates] = useState({});
//    const navigation = useNavigation<TScreenNavigator>();
//   const [attendanceSummary, setAttendanceSummary] = useState({
//     present: 0,
//     absent: 0,
//   });

//   // Hooks for self and lecture attendance
//   const { mutateAsync: markSelfAttendance, isPending: isMarkingSelf } =
//     useUpdateSelfAttendance();
//   const { mutateAsync: markLectureAttendance, isPending: isMarkingLecture } =
//     useMarkLectureAttendance();

//   // Fetch and update calendar attendance data
//   const fetchAttendanceData = async () => {
//     // Replace this with your actual attendance fetching logic
//     const attendanceData = [
//       { date: "2025-01-15", status: "present" },
//       { date: "2025-01-16", status: "absent" },
//       { date: "2025-01-17", status: "present" },
//     ];

//     const markedDatesData = {};
//     let presentCount = 0;
//     let absentCount = 0;

//     attendanceData.forEach((entry) => {
//       const color = entry.status === "present" ? COLORS.green : COLORS.red;
//       markedDatesData[entry.date] = {
//         selected: true,
//         selectedColor: color,
//       };
//       if (entry.status === "present") presentCount++;
//       if (entry.status === "absent") absentCount++;
//     });

//     setMarkedDates(markedDatesData);
//     setAttendanceSummary({ present: presentCount, absent: absentCount });
//   };

//   // Self-attendance check-in
//   const handleSelfCheckIn = async () => {
//     try {
//       const user = store.getState().auth.authUser;
//       const selectedOrganization = store.getState().auth.selectedOrganization;

//       if (!user || !selectedOrganization) {
//         Alert.alert("Error", "User or organization details not found.");
//         return;
//       }

//       const payload = {
//         batchId: "exampleBatchId",
//         attendanceDate: new Date(),
//         attendanceId: moment().format("YYYYMMDD"),
//         students: [],
//         employeeId: user.employeeId || user.customerId,
//       };

//       await markSelfAttendance(payload);
//       Alert.alert("Success", "Self Check-In Successful!");
//     } catch (error) {
//       console.error("Error in Self Check-In:", error);
//       Alert.alert("Error", "Failed to mark attendance.");
//     }
//   };

//   // Lecture-based attendance check-in
//   const handleLectureCheckIn = async () => {
//     try {
//       const user = store.getState().auth.authUser;

//       if (!user || !lectureId) {
//         Alert.alert("Error", "Invalid lecture details.");
//         return;
//       }

//       const payload = {
//         lectureId,
//         employeeId: user.employeeId || user.customerId,
//         attendanceDate: new Date().toISOString(),
//         status: "present",
//       };

//       await markLectureAttendance(payload);
//       Alert.alert("Success", "Lecture Attendance Marked Successfully!");
//       setShowPopup(false);
//     } catch (error) {
//       console.error("Error in Lecture Check-In:", error);
//       Alert.alert("Error", "Failed to mark lecture attendance.");
//     }
//   };

//   // Show lecture attendance popup if lectureId exists
//   useEffect(() => {
//     if (lectureId) {
//       setShowPopup(true);
//     }
//   }, [lectureId]);

//   // Fetch attendance data for the calendar on component mount
//   useEffect(() => {
//     fetchAttendanceData();
//   }, []);

//   return (
//     <SafeView>
//       <AppHeader
//         title="Attendance"
//         handleBackClick={() => navigation.goBack()}
//         showDrawer
//       />

//       <View style={styles.container}>
//         {/* Self Check-In */}
//         <Button
//           title="Self Check In"
//           loading={isMarkingSelf}
//           onPress={handleSelfCheckIn}
//           btnStyles={styles.checkInButton}
//         />

//         {/* Attendance Calendar */}
//         <Calendar
//           current={selectedDate.toISOString()}
//           markedDates={markedDates}
//           onDayPress={(day) => setSelectedDate(moment(day.dateString))}
//           theme={{
//             selectedDayBackgroundColor: COLORS.primary,
//             todayTextColor: COLORS.primary,
//             dayTextColor: COLORS.black,
//             arrowColor: COLORS.primary,
//             textDayFontFamily: "Poppins-Regular",
//             textMonthFontFamily: "Poppins-SemiBold",
//             textDayHeaderFontFamily: "Poppins-Regular",
//           }}
//         />

//         {/* Attendance Summary */}
//         <View style={styles.summaryContainer}>
//           <Text style={styles.summaryText}>
//             Present: {attendanceSummary.present}
//           </Text>
//           <Text style={styles.summaryText}>
//             Absent: {attendanceSummary.absent}
//           </Text>
//         </View>
//       </View>

//       {/* Lecture Attendance Popup */}
//       <Modal visible={showPopup} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Lecture Attendance</Text>
//             <Text style={styles.modalText}>
//               You have a lecture starting now. Please check in!
//             </Text>
//             <Button
//               title="Mark Attendance"
//               loading={isMarkingLecture}
//               onPress={handleLectureCheckIn}
//               btnStyles={styles.attendanceButton}
//             />
//             <Button
//               title="Cancel"
//               onPress={() => setShowPopup(false)}
//               btnStyles={styles.cancelButton}
//             />
//           </View>
//         </View>
//       </Modal>
//     </SafeView>
//   );
// };

// export default AttendanceStackNavigator;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   checkInButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   summaryContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 16,
//   },
//   summaryText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: COLORS.black,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     width: "80%",
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   modalText: {
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   attendanceButton: {
//     backgroundColor: COLORS.green,
//     paddingVertical: 12,
//     borderRadius: 8,
//     width: "100%",
//     marginBottom: 8,
//   },
//   cancelButton: {
//     backgroundColor: COLORS.red,
//     paddingVertical: 12,
//     borderRadius: 8,
//     width: "100%",
//   },
// });

