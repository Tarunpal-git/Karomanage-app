import { StyleSheet, View } from "react-native";
import React, { FC, memo, useMemo } from "react";
import Flex from "../../../../@ui/flex/Flex";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../colors";
import AnimatedCounter from "../../../../@ui/animated-views/AnimatedCounter";
import { getStatusChipPallet } from "../../../../utils/getStatusChipPallet";

interface IEmployeeAttendanceOverview {
  attendance: TSingleEmployeeAttendance;
}

const EmployeeAttendanceOverview: FC<IEmployeeAttendanceOverview> = ({
  attendance,
}) => {
  const overview = useMemo(() => {
    let absent = 0;
    let present = 0;
    let totalEmployees = 0;
    let halfDay = 0;
    let fullDay = 0;

    if (attendance) {
      absent = attendance.absent;
      present = attendance.present;
      totalEmployees = attendance.employees.length;

      attendance.employees.forEach((employee) => {
        if (employee.availablityStatus.status === "HalfDay") {
          halfDay += 1;
        }
        if (employee.availablityStatus.status === "FullDay") {
          fullDay += 1;
        }
      });
    }
    return {
      absent,
      present,
      totalEmployees,
      halfDay,
      fullDay,
    };
  }, [attendance]);
  return (
    <View>
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
              All Employee
            </ScalableText>
          </View>
          <AnimatedCounter
            textStyles={{ fontSize: 18 }}
            duration={250}
            endValue={overview.totalEmployees}
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
            endValue={overview.present}
          />
        </Flex>
      </Flex>
      <Flex flexWrap="wrap" mb={20}>
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
            endValue={overview.absent}
          />
        </Flex>
        <Flex styles={{ ...styles.overviewCard }} mx={5}>
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
              Full Day
            </ScalableText>
          </View>
          <AnimatedCounter
            textStyles={{ fontSize: 18 }}
            duration={250}
            endValue={overview.fullDay}
          />
        </Flex>
        <Flex styles={{ ...styles.overviewCard }} mx={5}>
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
              Half Day
            </ScalableText>
          </View>
          <AnimatedCounter
            textStyles={{ fontSize: 18 }}
            duration={250}
            endValue={overview.halfDay}
          />
        </Flex>
      </Flex>
    </View>
  );
};

export default memo(EmployeeAttendanceOverview);

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
