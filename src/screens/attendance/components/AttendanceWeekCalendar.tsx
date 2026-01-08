import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";

interface AttendanceWeekCalendarProps {
  startDate: Date;
  numDays: number;
  onDayPress?: (day: Date) => void;
}

const AttendanceWeekCalendar: React.FC<AttendanceWeekCalendarProps> = ({
  startDate,
  numDays,
  onDayPress,
}) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Function to generate dates with start date in the middle
  const generateDates = () => {
    const dates: Date[] = [];
    const middleIndex = Math.floor(numDays / 2);

    for (let i = -middleIndex; i <= middleIndex; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  // Render each day in the calendar
  const renderCalendarDays = () => {
    const dates = generateDates();
    return dates.map((date, index) => {
      const isStartDate = date.toDateString() === startDate.toDateString();

      const isToday = date.toDateString() === new Date().toDateString();
      return (
        <TouchableOpacity
          disabled={date > new Date()}
          onPress={() => onDayPress?.(date)}
          key={index}
          style={[
            styles.calendarDay,
            isStartDate && styles.highlightedDay,
            isToday && styles.currentDay,
          ]}
        >
          <ScalableText
            style={{
              fontSize: 13,
              color: isStartDate ? COLORS.primary : COLORS.black,
            }}
            fontFamily={isStartDate ? "Medium" : "Regular"}
          >
            {date.getDate()}
          </ScalableText>
          {isStartDate && (
            <ScalableText
              style={{
                fontSize: 12,
                marginTop: 0,
                color: isStartDate ? COLORS.primary : COLORS.black,
              }}
              fontFamily={isStartDate ? "Medium" : "Regular"}
            >
              {weekdays[date.getDay()]}
            </ScalableText>
          )}
        </TouchableOpacity>
      );
    });
  };

  return <View style={styles.container}>{renderCalendarDays()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  calendarDay: {
    alignItems: "center",
    padding: 2,
    width: 24,
    minHeight: 24,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    elevation: 5,
  },
  highlightedDay: {
    color: COLORS.primary,
    width: 36,
  },
  currentDay: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
});

export default AttendanceWeekCalendar;
