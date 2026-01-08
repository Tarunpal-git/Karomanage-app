/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, memo, useState } from "react";
import { Calendar, DateData } from "react-native-calendars";
import moment from "moment";
import { DayProps } from "react-native-calendars/src/calendar/day";

import Flex from "../../../@ui/flex/Flex";
import ActionIcon from "../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../images";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import Tooltip from "react-native-walkthrough-tooltip";
import { SCREEN_WIDTH } from "../../../constants/Screen";

interface ICalendarInput {
  date: Date;
  onChangeDate: (date: Date) => void;
}

const AttendanceDatePicker: FC<ICalendarInput> = ({ date, onChangeDate }) => {
  const [selected, setSelected] = useState(moment(date));
  const [showCalendar, setShowCalendar] = useState(false);

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
      date: DateData | undefined;
    }
  > = ({ date, marking }) => {
    const todayMark = date?.dateString === moment().format("YYYY-MM-DD");

    return (
      <TouchableOpacity
        disabled={moment(date?.dateString ?? "").toDate() > new Date()}
        onPress={() => {
          setSelected(moment(date?.dateString));
          onChangeDate(moment(date?.dateString).toDate());
          setShowCalendar(false);
        }}
        style={{
          ...styles.dayComponent,
          backgroundColor: marking?.selectedColor,
          borderBottomWidth: 2,
          borderColor: todayMark ? COLORS.primary : COLORS.white,
        }}
      >
        <ScalableText
          style={{
            fontSize: 11,
            marginTop: 3,
            color:
              moment(date?.dateString ?? "").toDate() > new Date()
                ? "#e7e7e7"
                : "#000",
          }}
          fontFamily="Regular"
        >
          {date?.day}
        </ScalableText>
      </TouchableOpacity>
    );
  };

  return (
    <Tooltip
      isVisible={showCalendar}
      horizontalAdjustment={1000}
      content={
        <View style={{ flex: 1 }}>
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
          />
        </View>
      }
      contentStyle={{
        backgroundColor: COLORS.white,
        elevation: 4, // No elevation
        borderRadius: 8,
        padding: 10,
        width: SCREEN_WIDTH - 48,
      }}
      placement={"bottom"}
      onClose={() => setShowCalendar(false)}
      backgroundColor="transparent"
    >
      <TouchableOpacity
        onPress={() => setShowCalendar(true)}
        activeOpacity={0.8}
      >
        <Flex>
          <ScalableText style={styles.batchTitle} fontFamily="Medium">
            {moment(date).format("MMM YYYY")}
          </ScalableText>
          <AutoHeightImage source={IMAGES.chevronDownPrimaryIcon} width={10} />
        </Flex>
      </TouchableOpacity>
    </Tooltip>
  );
};

export default memo(AttendanceDatePicker);

const styles = StyleSheet.create({
  batchTitle: {
    fontSize: 14,
    color: COLORS.primary,
    textTransform: "capitalize",
    marginRight: 9,
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
    minWidth: 135,
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
    fontSize: 13,
    textAlign: "center",
  },
});
