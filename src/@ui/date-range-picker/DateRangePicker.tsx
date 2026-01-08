/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, memo, useState } from "react";
import { Calendar, DateData } from "react-native-calendars";
import moment from "moment";
import { DayProps } from "react-native-calendars/src/calendar/day";

import Tooltip from "react-native-walkthrough-tooltip";
import Flex from "../flex/Flex";
import ActionIcon from "../action-icon/ActionIcon";
import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import ScalableText from "../scalable-text/ScalableText";
import { COLORS } from "../../colors";
import { SCREEN_WIDTH } from "../../constants/Screen";

interface IDateRangePicker {
  onChange: (data: {
    startDate: string;
    endDate: string;
    selectedCount: number;
  }) => void;
}

const DateRangePicker: FC<IDateRangePicker> = ({ onChange }) => {
  const [startDay, setStartDay] = useState<string | null>(null);
  const [endDay, setEndDay] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [selected, setSelected] = useState(moment());

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
    const isMarked = marking?.marked;
    const isStartingDay = marking?.startingDay;
    const isEndingDay = marking?.endingDay;

    let backgroundColor = "white";
    let textColor = "black";

    if (isMarked) {
      if (isStartingDay && isEndingDay) {
        backgroundColor = COLORS.primary;
        textColor = "white";
      } else if (isStartingDay) {
        backgroundColor = COLORS.primary;
        textColor = "white";
      } else if (isEndingDay) {
        backgroundColor = COLORS.primary;
        textColor = "white";
      } else {
        backgroundColor = COLORS.primary;
        textColor = "white";
      }
    }

    return (
      <TouchableOpacity
        onPress={() => {
          handleDayPress(date?.dateString ?? "");
        }}
        style={{
          ...styles.dayComponent,
          backgroundColor: backgroundColor,
          borderBottomWidth: todayMark ? 2 : 0,
          borderColor: todayMark ? COLORS.graphRed : COLORS.primary,
          padding: 2,
        }}
      >
        <ScalableText
          style={{ fontSize: 11, marginTop: 3, color: textColor }}
          fontFamily="Regular"
        >
          {date?.day}
        </ScalableText>
      </TouchableOpacity>
    );
  };

  const handleDayPress = (dateString: string) => {
    if (startDay && !endDay) {
      // Select end day and mark the range
      const dateRange: Record<string, any> = {};
      const start = moment(startDay);
      const end = moment(dateString);

      for (const d = start.clone(); d.isSameOrBefore(end); d.add(1, "days")) {
        dateRange[d.format("YYYY-MM-DD")] = {
          marked: true,
          textColor: "white",
          startingDay: d.format("YYYY-MM-DD") === startDay,
          endingDay: d.format("YYYY-MM-DD") === dateString,
          selected:
            d.format("YYYY-MM-DD") === startDay
              ? "blue"
              : d.format("YYYY-MM-DD") === dateString
              ? "red"
              : "black",
        };
      }

      setMarkedDates(dateRange);
      setEndDay(dateString);
      onChange({
        endDate: moment(dateString).format("DD-MM-YYYY") ?? "",
        startDate: moment(startDay).format("DD-MM-YYYY") ?? "",
        selectedCount: Object.keys(dateRange).length,
      });
      setShowCalendar(false);
    } else {
      setStartDay(dateString);
      setEndDay(null);
      setMarkedDates({
        [dateString!]: {
          marked: true,
          color: "black",
          textColor: "white",
          startingDay: true,
          endingDay: true,
        },
      });
    }
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
            onDayPress={(day: any) => handleDayPress(day.dateString)}
            monthFormat={"yyyy MMM"}
            hideArrows
            hideExtraDays
            enableSwipeMonths
            markingType={"period"}
            markedDates={markedDates}
            renderHeader={customCalenderHeader}
            dayComponent={renderDayComponent}
          />
        </View>
      }
      contentStyle={{
        backgroundColor: COLORS.white,
        elevation: 4,
        borderRadius: 8,
        padding: 10,
        width: SCREEN_WIDTH - 60,
      }}
      placement={"bottom"}
      onClose={() => {
        setShowCalendar(false);
        setMarkedDates({});
      }}
      backgroundColor="transparent"
    >
      <TouchableOpacity
        style={styles.dropDownRoot}
        onPress={() => setShowCalendar(true)}
      >
        <AutoHeightImage source={IMAGES.calendarIconOutline} width={9} />
        <ScalableText style={styles.dropdownText} fontFamily="Medium">
          {startDay && endDay ? `${startDay} - ${endDay}` : "Select Date"}
        </ScalableText>
        <View style={{ transform: [{ rotate: "180deg" }] }}>
          <AutoHeightImage width={10} source={IMAGES.gridiconDropdownIcon} />
        </View>
      </TouchableOpacity>
    </Tooltip>
  );
};

export default memo(DateRangePicker);

const styles = StyleSheet.create({
  batchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: 41,
    elevation: 4,
    borderRadius: 8,
    width: "100%",
  },
  batchTitle: {
    fontSize: 11,
    color: "#717171",
    textTransform: "capitalize",
  },
  calendarSection: {
    backgroundColor: COLORS.white,
    elevation: 4,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  calenderTitle: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 5,
  },
  dayComponent: {
    width: 20,
    height: 20,
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
  dropDownRoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 50,
    marginLeft: 5,
    borderWidth: 0.5,
    padding: 3,
    borderRadius: 3,
    borderColor: "#DBD8D8",
  },
  dropdownText: {
    fontSize: 9,
    marginTop: 3,
    marginHorizontal: 5,
  },
});
