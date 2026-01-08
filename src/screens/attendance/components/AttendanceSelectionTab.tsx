import { StyleSheet, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  TScreenNavigator,
  TScreenNavigatorParams,
} from "../../../types/navigator/screen-navigator";
import { COLORS } from "../../../colors";

const AttendanceSelectionTab = () => {
  const path = useRoute<RouteProp<TScreenNavigatorParams>>();

  const navigation = useNavigation<TScreenNavigator>();

  return (
    <Flex styles={styles.groupButtonRoot}>
      <TouchableOpacity
        onPress={() => navigation.replace("EmployeeAttendance")}
        style={{
          ...styles.groupedBtn,
          backgroundColor:
            path.name === "EmployeeAttendance" ? COLORS.primary : COLORS.white,
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
        }}
      >
        <ScalableText
          style={{
            ...styles.groupedBtnText,
            color:
              path.name === "EmployeeAttendance"
                ? COLORS.white
                : COLORS.primary,
          }}
          fontFamily="Medium"
        >
          Employee
        </ScalableText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.replace("StudentBatchList")}
        style={{
          ...styles.groupedBtn,
          backgroundColor:
            path.name !== "EmployeeAttendance" ? COLORS.primary : COLORS.white,
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
        }}
      >
        <ScalableText
          style={{
            ...styles.groupedBtnText,
            color:
              path.name !== "EmployeeAttendance"
                ? COLORS.white
                : COLORS.primary,
          }}
          fontFamily="Medium"
        >
          Student
        </ScalableText>
      </TouchableOpacity>
    </Flex>
  );
};

export default memo(AttendanceSelectionTab);

const styles = StyleSheet.create({
  groupButtonRoot: {
    width: 220,
    backgroundColor: COLORS.white,
    elevation: 5,
    borderRadius: 6,
  },
  groupedBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 41,
  },
  groupedBtnText: {
    fontSize: 13,
  },
});
