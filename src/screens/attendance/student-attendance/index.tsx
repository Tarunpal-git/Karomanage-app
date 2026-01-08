import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import AppHeader from "../../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import Flex from "../../../@ui/flex/Flex";
import AttendanceSelectionTab from "../components/AttendanceSelectionTab";
import Divider from "../../../@ui/divider/Divider";
import AttendanceDatePicker from "../components/AttendanceDatePicker";
import AttendanceWeekCalendar from "../components/AttendanceWeekCalendar";
import { useSingleAttendanceQuery } from "../../../apis/hooks/attendance/query/useSingleAttendance.query";
import moment from "moment";
import UnmarkedStudentsAttendanceView from "./components/UnmarkedStudentsAttendanceView";
import MarkedStudentAttendanceView from "./components/MarkedStudentAttendanceView";

const StudentAttendance = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const { batchId } =
    useRoute<RouteProp<TScreenNavigatorParams, "StudentAttendance">>().params;

  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    refetch,
  } = useSingleAttendanceQuery({
    attendanceId: moment(attendanceDate).format("YYYYMMDD"),
    batchId,
  });

  const attendance: TSingleAttendance = useMemo(() => {
    if (!attendanceLoading && attendanceData.statusCode === 200) {
      return attendanceData.data;
    } else {
      return undefined;
    }
  }, [attendanceLoading, attendanceData]);

  return (
    <SafeView>
      <AppHeader
        title="Student Attendance"
        handleBackClick={() => navigation.goBack()}
        showDrawer={false}
      />
      <ThemeScrollView paddingHorizontal={15} loading={attendanceLoading}>
        <Flex justify="flex-end">
          <AttendanceSelectionTab />
        </Flex>
        <Divider my={20} />
        <Flex flexDirection="column" align="flex-start">
          <AttendanceDatePicker
            date={attendanceDate}
            onChangeDate={(date) => setAttendanceDate(date)}
          />
        </Flex>
        <Flex mt={10}>
          <AttendanceWeekCalendar
            numDays={9}
            startDate={attendanceDate}
            onDayPress={(day) => setAttendanceDate(day)}
          />
        </Flex>
        <Divider my={20} />

        {!attendance && (
          <UnmarkedStudentsAttendanceView
            attendanceDate={attendanceDate}
            refetch={refetch}
          />
        )}

        {attendance && (
          <MarkedStudentAttendanceView
            attendance={attendance}
            attendanceDate={attendanceDate}
            refetch={refetch}
          />
        )}
      </ThemeScrollView>
    </SafeView>
  );
};

export default StudentAttendance;
