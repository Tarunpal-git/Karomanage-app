import { StyleSheet, View } from "react-native";
import React, { FC, memo } from "react";
import Flex from "../../../../@ui/flex/Flex";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../colors";
import AnimatedCounter from "../../../../@ui/animated-views/AnimatedCounter";
import { getStatusChipPallet } from "../../../../utils/getStatusChipPallet";

interface IAttendanceOverviewSection {
  data: {
    absent: number;
    totalStudents: number;
    present: number;
  };
}

const AttendanceOverviewSection: FC<IAttendanceOverviewSection> = ({
  data: { absent = 0, present = 0, totalStudents = 0 },
}) => {
  return (
    <Flex flexWrap="wrap" mb={20}>
      <Flex styles={{ ...styles.overviewCard }}>
        <View
          style={{
            ...styles.statusChip,
            backgroundColor: getStatusChipPallet("info").background,
          }}
        >
          <ScalableText
            style={{
              ...styles.statusChipText,
              color: getStatusChipPallet("info").textColor,
            }}
            fontFamily="Medium"
          >
            All Student
          </ScalableText>
        </View>
        <AnimatedCounter
          textStyles={{ fontSize: 18 }}
          duration={250}
          endValue={totalStudents}
        />
      </Flex>
      <Flex styles={{ ...styles.overviewCard }} mx={5}>
        <View
          style={{
            ...styles.statusChip,
            backgroundColor: getStatusChipPallet("success").background,
          }}
        >
          <ScalableText
            style={{
              ...styles.statusChipText,
              color: getStatusChipPallet("success").textColor,
            }}
            fontFamily="Medium"
          >
            Present
          </ScalableText>
        </View>
        <AnimatedCounter
          textStyles={{ fontSize: 18 }}
          duration={250}
          endValue={present}
        />
      </Flex>
      <Flex styles={{ ...styles.overviewCard }}>
        <View
          style={{
            ...styles.statusChip,
            backgroundColor: getStatusChipPallet("error").background,
          }}
        >
          <ScalableText
            style={{
              ...styles.statusChipText,
              color: getStatusChipPallet("error").textColor,
            }}
            fontFamily="Medium"
          >
            Absent
          </ScalableText>
        </View>
        <AnimatedCounter
          textStyles={{ fontSize: 18 }}
          duration={250}
          endValue={absent}
        />
      </Flex>
    </Flex>
  );
};

export default memo(AttendanceOverviewSection);

const styles = StyleSheet.create({
  overviewCard: {
    elevation: 4,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    flex: 1,
    flexDirection: "column",
    minHeight: 90,
    justifyContent: "center",
  },
  statusChip: {
    marginBottom: 5,
    backgroundColor: "red",
    minWidth: 80,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 29,
  },
  statusChipText: {
    fontSize: 12,
    marginTop: 3,
  },
});
