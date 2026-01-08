import moment from 'moment';
import { MarkedDates } from 'react-native-calendars/src/types';

export const transformAttendanceHistory = (
  attendanceHistory: TAttendanceHistory[] = [],
  selectedDate: Date = new Date()
) => {
  const attendanceMarkedMap: MarkedDates = {};
  let presentCount = 0;
  let absentCount = 0;
  
  // Get the month and year of the selected date
  const selectedMonth = moment(selectedDate).month();
  const selectedYear = moment(selectedDate).year();

  attendanceHistory.forEach((record) => {
    const recordDate = moment(record.attendanceId);

    // Check if the record's month and year match the selected date's month and year
    if (
      recordDate.month() === selectedMonth &&
      recordDate.year() === selectedYear
    ) {
      const date = recordDate.format('YYYY-MM-DD');
      if (record.attendanceStatus === 'present') {
        attendanceMarkedMap[date] = { marked: true, selectedColor: '#D0FFBA' };
        presentCount++;
      } else if (record.attendanceStatus === 'absent') {
        attendanceMarkedMap[date] = { marked: true, selectedColor: '#FFCDCD' };
        absentCount++;
      }
    }
  });

  return {
    markedDates: attendanceMarkedMap,
    attendance: {
      presentCount,
      absentCount,
    },
  };
};
