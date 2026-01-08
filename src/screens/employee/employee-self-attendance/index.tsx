// employeeSelfAttendance.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CalendarInput from "../../../@ui/calendar-input/CalendarInput";
import Button from "../../../@ui/button/Button";
import { COLORS } from "../../../colors";
import { Control, FieldValues, UseFormSetValue, UseFormWatch, useForm } from "react-hook-form";
import { store } from "../../../app/store";
import { useUpdateSelfAttendance } from "../../../apis/hooks/attendance/mutation/Updateselfattendance";
import moment from "moment";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import Flex from "../../../@ui/flex/Flex";
import { Calendar } from "react-native-calendars";
import { useStudentAttendanceListQuery } from "../../../apis/hooks/attendance/query/useStudentAttendanceList.query";
import { useMemo } from "react";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import ActionIcon from "../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";

const EmployeeSelfAttendance = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const formMethods = useForm();
  const { control, setValue, watch } = formMethods;
  const [selected, setSelected] = useState(moment());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [isCheckedOut, setIsCheckedOut] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<moment.Moment | null>(null);
  const [endTime, setEndTime] = useState<moment.Moment | null>(null);
  const [totalWorkingTime, setTotalWorkingTime] = useState<string>("");

  // Get user and organization data from store
  const user = store.getState().auth.authUser;
  const selectedOrganization = store.getState().auth.selectedOrganization;

  // Mock batch and employee data (replace with actual data)
  const batchId = "exampleBatchId";
  const employeeId = user?.employeeId || user?.customerId || "";

  // Use the proper API hook
  const { mutateAsync, isPending } = useUpdateSelfAttendance();
  const { data: attendanceData, isLoading, refetch } = useStudentAttendanceListQuery({
    batchId,
    studentId: employeeId, // Using employeeId as studentId for attendance history
  });

  // Check if user is already checked in today and if they've checked out
  useEffect(() => {
    console.log("attendanceDataaaa", attendanceData);
    if (attendanceData?.data) {
      const today = moment().format("YYYY-MM-DD");
      const todayAttendance = attendanceData.data.attendanceHistory?.find((entry: any) =>
        moment(entry.attendanceDate).format("YYYY-MM-DD") === today
      );
      
      if (todayAttendance && todayAttendance.attendanceStatus === "present") {
        // Check if there's a check-out time recorded
        if (todayAttendance.checkOutTime) {
          setIsCheckedIn(false);
          setIsCheckedOut(true);
          setStartTime(moment(todayAttendance.checkInTime));
          setEndTime(moment(todayAttendance.checkOutTime));
          
          // Calculate total working time
          const duration = moment.duration(moment(todayAttendance.checkOutTime).diff(moment(todayAttendance.checkInTime)));
          const hours = Math.floor(duration.asHours());
          const minutes = duration.minutes();
          setTotalWorkingTime(`${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : 00`);
        } else {
          // Only checked in, not checked out yet
          setIsCheckedIn(true);
          setIsCheckedOut(false);
          setStartTime(moment(todayAttendance.checkInTime || moment().startOf('day')));
        }
      }
    }
  }, [attendanceData]);
  console.log("attendanceData", attendanceData);

  // Function to handle Check-In API call
  const handleCheckIn = async () => {
    // Prevent check-in if already checked out today
    if (isCheckedOut) {
      Alert.alert("Info", "You have already completed your attendance for today");
      return;
    }

    // Prevent check-in if already checked in today
    if (isCheckedIn) {
      Alert.alert("Info", "You have already checked in today. Please check out first.");
      return;
    }

    if (!user || !selectedOrganization) {
      Alert.alert("Error", "User or Organization details not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        batchId,
        attendanceDate: new Date(),
        attendanceId: moment().format("YYYYMMDD"),
        students: [],
        employeeId: employeeId,
      };

      console.log("[EmployeeSelfAttendance] Sending payload:", payload);

      const response = await mutateAsync(payload);

      console.log("[EmployeeSelfAttendance] API Response:", response);

      if (response.statusCode === 200) {
        Alert.alert("Success", "Check-In Successful!");
        setIsCheckedIn(true);
        setStartTime(moment());
        refetch(); // Refresh attendance data
      } else {
        Alert.alert("Info", "You have already checked in today.");
      }
    } catch (error) {
      console.error("[EmployeeSelfAttendance] Error:", error);
      Alert.alert("Error", "Failed to mark attendance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle Check-Out
  const handleCheckOut = async () => {
    if (!isCheckedIn) {
      Alert.alert("Info", "You need to check in first before checking out");
      return;
    }

    setIsSubmitting(true);
    try {
      const checkOutTime = moment();
      const totalWorkingHours = startTime ? checkOutTime.diff(startTime, 'hours', true) : 0;
      const totalWorkingMinutes = startTime ? checkOutTime.diff(startTime, 'minutes', true) : 0;
      
      // Calculate total working time in HH:MM:SS format
      const duration = moment.duration(checkOutTime.diff(startTime));
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      const totalTimeString = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;

      const payload = {
        batchId,
        attendanceDate: new Date(),
        attendanceId: moment().format("YYYYMMDD"),
        students: [],
        employeeId: employeeId,
      };

      const response = await mutateAsync(payload);

      if (response.statusCode === 200) {
        setIsCheckedIn(false);
        setIsCheckedOut(true);
        setEndTime(checkOutTime);
        setTotalWorkingTime(totalTimeString);
        
        Alert.alert(
          "Check-Out Successful", 
          `Total Working Time: ${totalTimeString}\nHours: ${totalWorkingHours.toFixed(2)}\nMinutes: ${totalWorkingMinutes.toFixed(0)}`
        );
        
        refetch(); // Refresh attendance data
      } else {
        Alert.alert("Error", "Failed to check out");
      }
    } catch (error) {
      console.error("[EmployeeSelfAttendance] Error:", error);
      Alert.alert("Error", "Failed to check out. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process attendance data for calendar
  const attendanceDateAndCounts = useMemo(() => {
    if (isLoading) {
      return { markedDates: undefined, attendance: { presentCount: 0, absentCount: 0 } };
    }

    if (attendanceData?.data) {
      const studentAttendance = attendanceData.data;
      let presentCount = 0;
      let absentCount = 0;
      

      const filteredAttendance = studentAttendance.attendanceHistory?.filter((entry: any) =>
        moment(entry.attendanceDate).isSame(selected, "month")
      ) || [];

      const markedDates = filteredAttendance.reduce((acc: any, entry: any) => {
        const entryDate = moment(entry.attendanceDate).format("YYYY-MM-DD");
        acc[entryDate] = {
          status: entry.attendanceStatus,
          color: entry.attendanceStatus === "present" ? COLORS.graphGreen : COLORS.graphRed,
        };
        if (entry.attendanceStatus === "present") {
          presentCount++;
        } else if (entry.attendanceStatus === "absent") {
          absentCount++;
        }
        return acc;
      }, {});

      return {
        markedDates,
        attendance: {
          presentCount,
          absentCount,
        },
      };
    } else {
      return {markedDates: undefined, attendance: { presentCount: 0, absentCount: 0}};
    }
  }, [isLoading, attendanceData, selected]);

  const customCalenderHeader = () => (
    <Flex justify="space-between" w={"100%"} mb={15}>
      <Flex mx={-10}>
        <ActionIcon
          styles={{ paddingHorizontal: 10 }}
          onPress={() => setSelected(moment(selected).subtract(1, "M"))}
        >
          <AutoHeightImage width={8} source={IMAGES.chevronArrowLeftIcon} />
        </ActionIcon>
        <ScalableText style={styles.calenderTitle} fontFamily="SemiBold">
          {moment(selected).format("MMMM")}
        </ScalableText>
        <ActionIcon
          onPress={() => setSelected(moment(selected).add(1, "M"))}
          styles={{ paddingHorizontal: 10 }}
        >
          <AutoHeightImage width={8} source={IMAGES.chevronArrowRightIcon} />
        </ActionIcon>
      </Flex>
      <Flex mx={-10}>
        <ActionIcon
          styles={{ paddingHorizontal: 10 }}
          onPress={() => setSelected(moment(selected).subtract(1, "y"))}
        >
          <AutoHeightImage width={8} source={IMAGES.chevronArrowLeftIcon} />
        </ActionIcon>
        <ScalableText
          style={{ ...styles.calenderTitle, fontSize: 14 }}
          fontFamily="SemiBold"
        >
          {moment(selected).format("YYYY")}
        </ScalableText>
        <ActionIcon
          styles={{ paddingHorizontal: 10 }}
          onPress={() => setSelected(moment(selected).add(1, "y"))}
        >
          <AutoHeightImage width={8} source={IMAGES.chevronArrowRightIcon} />
        </ActionIcon>
      </Flex>
    </Flex>
  );

  const renderDayComponent = ({ date }: any) => {
    const isToday = date?.dateString === moment().format("YYYY-MM-DD");
    const isPresent =
      date?.dateString && attendanceDateAndCounts.markedDates?.[date.dateString]?.status === "present";
    const isAbsent =
      date?.dateString && attendanceDateAndCounts.markedDates?.[date.dateString]?.status === "absent";

    const backgroundColor = isPresent
      ? COLORS.graphGreen
      : isAbsent
      ? COLORS.graphRed
      : COLORS.white;

    return (
      <Flex
        styles={{
          ...styles.dayComponent,
          backgroundColor,
          borderBottomWidth: 3,
          borderColor: isToday ? COLORS.primary : COLORS.white,
        }}
      >
        <ScalableText style={{ fontSize: 11, marginTop: 3 }} fontFamily="Regular">
          {date?.day}
        </ScalableText>
      </Flex>
    );
  };

  return (
    <SafeView>
      <AppHeader
        title="Employee Self Attendance"
        handleBackClick={() => navigation.goBack()}
        showDrawer
      />
      <View style={styles.container}>
        {/* Employee Info */}
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{user?.customerName || "Employee"}</Text>
          <Text style={styles.employeeId}>ID: {employeeId}</Text>
          <Text style={styles.currentDate}>{moment().format("MMMM DD, YYYY")}</Text>
        </View>

        {/* Check-In/Check-Out Buttons */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
          {!isCheckedIn && !isCheckedOut ? (
            <Button
              title="Check In"
              onPress={handleCheckIn}
              loading={isPending || isSubmitting}
              disabled={isPending || isSubmitting}
              btnStyles={styles.checkInButton}
              btnTxtStyles={styles.checkInButtonText}
            />
          ) : isCheckedIn && !isCheckedOut ? (
            <Button
              title="Check Out"
              onPress={handleCheckOut}
              loading={isPending || isSubmitting}
              disabled={isPending || isSubmitting}
              btnStyles={{ ...styles.checkInButton, backgroundColor: COLORS.error }}
              btnTxtStyles={styles.checkInButtonText}
            />
          ) : (
            <Button
              title="Attendance Complete"
              btnStyles={{ ...styles.checkInButton, backgroundColor: COLORS.muted }}
              btnTxtStyles={styles.checkInButtonText}
              disabled={true}
            />
          )}
        </View>

        {/* Working Time Display */}
        {isCheckedOut && (
          <View style={styles.workingTimeContainer}>
            <Text style={styles.workingTimeTitle}>Total Working Time</Text>
            <Text style={styles.workingTime}>{totalWorkingTime}</Text>
            <Text style={styles.workingTimeDetails}>
              Checked In: {startTime?.format("HH:mm")} | Checked Out: {endTime?.format("HH:mm")}
            </Text>
          </View>
        )}

        {/* Calendar */}
        <View style={styles.calendarSection}>
          <Calendar
            current={selected.toString()}
            key={selected.toString()}
            theme={{
              textDayHeaderFontFamily: "Poppins-Regular",
              textDayHeaderFontSize: 12,
            }}
            onMonthChange={(date: any) => setSelected(moment(date.dateString))}
            renderHeader={customCalenderHeader}
            hideArrows
            hideExtraDays
            enableSwipeMonths
            dayComponent={renderDayComponent}
            markedDates={attendanceDateAndCounts.markedDates}
          />
        </View>

        {/* Attendance Summary */}
        <Flex justify="space-between" mt={20}>
          <Button
            btnStyles={styles.attendanceStatusBtn}
            btnTxtStyles={{ ...styles.attendanceStatusBtnText, color: COLORS.graphGreen }}
            title={`Present: ${attendanceDateAndCounts.attendance.presentCount}`}
          />
          <Button
            btnStyles={styles.attendanceStatusBtn}
            btnTxtStyles={{ ...styles.attendanceStatusBtnText, color: COLORS.graphRed }}
            title={`Absent: ${attendanceDateAndCounts.attendance.absentCount}`}
          />
        </Flex>
      </View>
    </SafeView>
  );
};

export default EmployeeSelfAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  employeeInfo: {
    backgroundColor: COLORS.lighterBlue,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 5,
  },
  employeeId: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 5,
  },
  currentDate: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  checkInButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 20,
  },
  checkInButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  calendarSection: {
    flex: 1,
    marginBottom: 20,
  },
  calenderTitle: {
    fontSize: 16,
    color: COLORS.primary,
  },
  dayComponent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  attendanceStatusBtn: {
    minWidth: 20,
    height: 37,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    elevation: 2,
    flex: 1,
    marginHorizontal: 10,
  },
  attendanceStatusBtnText: {
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
    fontSize: 12,
    textAlign: "center",
  },
  workingTimeContainer: {
    backgroundColor: COLORS.lighterBlue,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  workingTimeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  workingTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 5,
  },
  workingTimeDetails: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
  },
});