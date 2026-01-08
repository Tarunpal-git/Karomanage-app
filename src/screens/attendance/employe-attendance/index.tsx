import React, { useMemo, useState } from "react";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../../types/navigator/screen-navigator";
import Flex from "../../../@ui/flex/Flex";
import AttendanceSelectionTab from "../components/AttendanceSelectionTab";
import Divider from "../../../@ui/divider/Divider";
import AttendanceWeekCalendar from "../components/AttendanceWeekCalendar";
import ThemeScrollView from "../../../@ui/theme-scroll-view/ThemeScrollView";
import AttendanceDatePicker from "../components/AttendanceDatePicker";
import UnmarkedEmployeeAttendance from "./components/UnmarkedEmployeeAttendance";
import { useSingleEmployeeAttendanceQuery } from "../../../apis/hooks/attendance/query/useSingleEmployeeAttendance.query";
import moment from "moment";
import MarkedEmployeeAttendance from "./components/MarkedEmployeeAttendance";

const EmployeeAttendance = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const [attendanceDate, setAttendanceDate] = useState(new Date());

  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    refetch,
  } = useSingleEmployeeAttendanceQuery({
    attendanceId: moment(attendanceDate).format("YYYYMMDD"),
  });

  const attendance: TSingleEmployeeAttendance = useMemo(() => {
    if (!attendanceLoading && attendanceData.statusCode === 200) {
      return attendanceData.data;
    } else {
      return undefined;
    }
  }, [attendanceLoading, attendanceData]);

  return (
    <SafeView>
      <AppHeader
        title="Employee Attendance"
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
          <UnmarkedEmployeeAttendance
            attendanceDate={attendanceDate}
            refetch={refetch}
          />
        )}
        {attendance && (
          <MarkedEmployeeAttendance
            attendance={attendance}
            attendanceDate={attendanceDate}
            refetch={refetch}
          />
        )}
      </ThemeScrollView>
    </SafeView>
  );
};

export default EmployeeAttendance;
