import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, memo, useMemo, useState } from "react";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import AutoHeightImage from "../../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../../images";
import { COLORS } from "../../../../../colors";
import { useBatchDetailsQuery } from "../../../../../apis/hooks/batch/query/useBatchDetails.query";
import Flex from "../../../../../@ui/flex/Flex";
import { Calendar, DateData } from "react-native-calendars";
import ActionIcon from "../../../../../@ui/action-icon/ActionIcon";
import moment from "moment";
import { DayProps } from "react-native-calendars/src/calendar/day";
import Button from "../../../../../@ui/button/Button";
import { useStudentAttendanceListQuery } from "../../../../../apis/hooks/attendance/query/useStudentAttendanceList.query";
import Center from "../../../../../@ui/center/Center";
import { transformAttendanceHistory } from "./utils/transformAttendanceHistory";
import Tooltip from "react-native-walkthrough-tooltip";
import { SCREEN_WIDTH } from "../../../../../constants/Screen";

interface IPopoverBatchRow {
  batchId: string;
  studentId: string;
  index: number;
}

const PopoverBatchRow: FC<IPopoverBatchRow> = ({
  batchId,
  studentId,
  index,
}) => {
  const [selected, setSelected] = useState(moment());
  const { data } = useBatchDetailsQuery({ batchId: batchId });
  const [showCalendar, setShowCalendar] = useState(false);

  const { data: attendanceData, isLoading } = useStudentAttendanceListQuery({
    batchId: batchId,
    studentId: studentId,
  });

  const attendanceDateAndCounts = useMemo(() => {
    if (!isLoading && attendanceData.data) {
      const studentAttendance: TStudentAttendanceData = attendanceData.data;

      return transformAttendanceHistory(
        studentAttendance.attendanceHistory,
        selected.toDate()
      );
    } else {
      return {
        markedDates: undefined,
        attendance: {
          presentCount: 0,
          absentCount: 0,
        },
      };
    }
  }, [isLoading, attendanceData, selected]);

  const customCalenderHeader = () => {
    return (
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
  };

  const renderDayComponent: React.ComponentType<
    DayProps & {
      date?: DateData | undefined;
    }
  > = ({ date, marking }) => {
    const todayMark = date?.dateString === moment().format("YYYY-MM-DD");

    return (
      <Flex
        styles={{
          ...styles.dayComponent,
          backgroundColor: marking?.selectedColor,
          borderBottomWidth: 2,
          borderColor: todayMark ? COLORS.primary : COLORS.white,
        }}
      >
        <ScalableText
          style={{ fontSize: 11, marginTop: 3 }}
          fontFamily="Regular"
        >
          {date?.day}
        </ScalableText>
      </Flex>
    );
  };

  return (
    <Tooltip
      isVisible={showCalendar}
      horizontalAdjustment={1000}
      content={
        <Flex>
          {isLoading && (
            <Center styles={{ minHeight: 250 }}>
              <ActivityIndicator size={"large"} color={COLORS.primary} />
            </Center>
          )}
          {!isLoading && (
            <View style={{ flex: 1 }}>
              <Flex
                align="flex-end"
                justify="flex-end"
                styles={{ paddingBottom: 10 }}
              >
                <ActionIcon onPress={() => setShowCalendar(false)}>
                  <AutoHeightImage
                    source={IMAGES.crossPrimaryIcon}
                    width={21}
                  />
                </ActionIcon>
              </Flex>
              <Calendar
                current={selected.toString()}
                key={selected.toString()}
                theme={{
                  textDayHeaderFontFamily: "Poppins-Regular",
                  textDayHeaderFontSize: 12,
                }}
                onMonthChange={(date: any) =>
                  setSelected(moment(date.dateString))
                }
                renderHeader={customCalenderHeader}
                hideArrows
                hideExtraDays
                enableSwipeMonths
                dayComponent={renderDayComponent}
                markedDates={attendanceDateAndCounts?.markedDates || {}}
              />

              <Flex justify="space-between" mx={10}>
                <Button
                  btnStyles={styles.attendanceStatusBtn}
                  btnTxtStyles={{
                    ...styles.attendanceStatusBtnText,
                    color: "#0DA800",
                  }}
                  title={`Present Count : ${attendanceDateAndCounts?.attendance?.presentCount || 0}`}
                />
                <Button
                  btnStyles={styles.attendanceStatusBtn}
                  btnTxtStyles={{
                    ...styles.attendanceStatusBtnText,
                    color: "#FF7878",
                  }}
                  title={`Absent Count : ${attendanceDateAndCounts?.attendance?.absentCount || 0}`}
                />
              </Flex>
            </View>
          )}
        </Flex>
      }
      contentStyle={{
        backgroundColor: COLORS.white,
        elevation: 4, // No elevation
        borderRadius: 8,
        padding: 10,
        width: SCREEN_WIDTH - 45,
        height: 390,
      }}
      placement={index > 2 ? "top" : "bottom"}
      onClose={() => {}}
      backgroundColor="transparent"
    >
      <TouchableOpacity
        onPress={() => setShowCalendar(true)}
        style={styles.batchRow}
        activeOpacity={0.8}
      >
        <ScalableText style={styles.batchTitle} fontFamily="SemiBold">
          {data?.data.batchName}
        </ScalableText>
        <AutoHeightImage source={IMAGES.calendarIcon} width={24} />
      </TouchableOpacity>
    </Tooltip>
  );
};

export default memo(PopoverBatchRow);

const styles = StyleSheet.create({
  batchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 18,
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginTop: 25,

    // Android shadow property
    elevation: 4, // No elevation
    borderRadius: 8,
  },
  batchTitle: {
    fontSize: 16,
    color: COLORS.primary,
    textTransform: "capitalize",
  },

  calendarSection: {
    backgroundColor: COLORS.white,
    elevation: 4, // No elevation
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    // position: "absolute",
    // zIndex: 500,
    // top: 85,
  },
  calenderTitle: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 5,
  },
  dayComponent: {
    width: 17,
    height: 17,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  attendanceStatusBtn: {
    minWidth: 130,
    height: 37,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  attendanceStatusBtnText: {
    fontFamily: "Poppins-Regular",
    color: COLORS.black,
    fontSize: 13,
    textAlign: "center",
  },
});
