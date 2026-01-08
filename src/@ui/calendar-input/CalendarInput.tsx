/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, TouchableOpacity, View, Modal, Dimensions } from "react-native";
import React, { FC, memo, useState } from "react";
import { Calendar, DateData } from "react-native-calendars";
import moment from "moment";
import { DayProps } from "react-native-calendars/src/calendar/day";
import Flex from "../flex/Flex";
import ActionIcon from "../action-icon/ActionIcon";
import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import ScalableText from "../scalable-text/ScalableText";
import { COLORS } from "../../colors";
import { SCREEN_WIDTH } from "../../constants/Screen";
import { UseFormReturn, Controller } from "react-hook-form";

interface ICalendarInput {
  label: string;
  handler: UseFormReturn<any>;
  name: string;
}

const CalendarInput: FC<ICalendarInput> = ({ label, handler, name }) => {
  const [selected, setSelected] = useState(moment());
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
            onPress={() => setSelected(moment(selected).add(1, "y"))}
            styles={{ paddingHorizontal: 10 }}
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
        onPress={() => {
          setSelected(moment(date?.dateString));
          handler.setValue(name, date?.dateString);
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
          style={{ fontSize: 11, marginTop: 3 }}
          fontFamily="Regular"
        >
          {date?.day}
        </ScalableText>
      </TouchableOpacity>
    );
  };

  return (
    <Controller
      name={name}
      control={handler.control}
      render={({ field: { value }, fieldState: { error } }) => (
        <>
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            style={styles.batchRow}
            activeOpacity={0.8}
          >
            <ScalableText 
              style={{
                ...styles.batchTitle,
                color: value ? COLORS.black : "#717171"
              }} 
              fontFamily="Regular"
            >
              {value
                ? moment(value).format("YYYY-MM-DD")
                : label}
            </ScalableText>
            <AutoHeightImage source={IMAGES.calendarInputIcon} width={24} />
          </TouchableOpacity>
          {error && (
            <ScalableText
              fontFamily="Regular"
              style={{
                color: COLORS.error,
                fontSize: 11,
                marginTop: 4,
              }}
            >
              {error.message}
            </ScalableText>
          )}

          <Modal
            visible={showCalendar}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowCalendar(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.calendarModal}>
                <View style={styles.calendarHeader}>
                  <ScalableText style={styles.modalTitle} fontFamily="Medium">
                    Select Date
                  </ScalableText>
                  <TouchableOpacity
                    onPress={() => setShowCalendar(false)}
                    style={styles.closeButton}
                  >
                    <ScalableText style={styles.closeButtonText} fontFamily="Medium">
                      ✕
                    </ScalableText>
                  </TouchableOpacity>
                </View>
                <View style={styles.calendarContainer}>
                  <Calendar
                    current={selected.toString()}
                    key={selected.toString()}
                    theme={{
                      textDayHeaderFontFamily: "Poppins-Regular",
                      textDayHeaderFontSize: 12,
                      textDayFontSize: 14,
                      textMonthFontSize: 16,
                      textDayHeaderColor: COLORS.black,
                      textDayColor: COLORS.black,
                      textMonthColor: COLORS.primary,
                      selectedDayBackgroundColor: COLORS.primary,
                      selectedDayTextColor: COLORS.white,
                      todayTextColor: COLORS.primary,
                      arrowColor: COLORS.primary,
                    }}
                    onMonthChange={(date: any) => setSelected(moment(date.dateString))}
                    renderHeader={customCalenderHeader}
                    hideArrows
                    hideExtraDays
                    enableSwipeMonths
                    dayComponent={renderDayComponent}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    />
  );
};

export default memo(CalendarInput);

const styles = StyleSheet.create({
  batchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  batchTitle: {
    fontSize: 14,
    color: COLORS.black,
    textTransform: "capitalize",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: SCREEN_WIDTH - 40,
    maxHeight: Dimensions.get('window').height * 0.7,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.black,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  calendarContainer: {
    padding: 15,
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
});
