import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import SafeView from "../../../@ui/safe-view/SafeView";
import AppHeader from "../../../@ui/app-header/AppHeader";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { TScreenNavigator, TScreenNavigatorParams } from "../../../types/navigator/screen-navigator";
import Flex from "../../../@ui/flex/Flex";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../colors";
import StudentCalendarView from "../student-calendar-view";
import EmployeeCalendarView from "../employee-calendar-view";

type AttendanceCalendarRouteProp = RouteProp<TScreenNavigatorParams, "AttendanceCalendar">;

const AttendanceCalendar = () => {
  const navigation = useNavigation<TScreenNavigator>();
  const route = useRoute<AttendanceCalendarRouteProp>();
  const [activeTab, setActiveTab] = useState<"student" | "employee">("student");

  return (
    <SafeView>
      <AppHeader
        title="Attendance"
        handleBackClick={() => navigation.goBack()}
        showDrawer={false}
      />
      <View style={styles.screenRoot}>
        {/* Tabs */}
        <Flex styles={styles.tabContainer} justify="center" align="center" mt={12}>
          <View style={styles.tabGroup}>
            <TouchableOpacity
              onPress={() => setActiveTab("student")}
              style={[
                styles.tab,
                activeTab === "student" && styles.activeTab,
                styles.tabLeft,
              ]}
              activeOpacity={0.85}
            >
              <ScalableText
                style={[
                  styles.tabText,
                  activeTab === "student" && styles.activeTabText,
                ]}
                fontFamily="Medium"
              >
                Student
              </ScalableText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("employee")}
              style={[
                styles.tab,
                activeTab === "employee" && styles.activeTab,
                styles.tabRight,
              ]}
              activeOpacity={0.85}
            >
              <ScalableText
                style={[
                  styles.tabText,
                  activeTab === "employee" && styles.activeTabText,
                ]}
                fontFamily="Medium"
              >
                Employee
              </ScalableText>
            </TouchableOpacity>
          </View>
        </Flex>

        {/* Content */}
        <View style={styles.contentCard}>
          {activeTab === "student" ? (
            <StudentCalendarView />
          ) : (
            <EmployeeCalendarView />
          )}
        </View>
      </View>
    </SafeView>
  );
};

export default AttendanceCalendar;

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: COLORS.lighterBlue,
  },
  tabContainer: {
    paddingHorizontal: 16,
  },
  tabGroup: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    elevation: 6,
    padding: 2,
    width: "70%",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 20,
  },
  tabLeft: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  tabRight: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    color: COLORS.primary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  contentCard: {
    flex: 1,
    marginTop: 12,
  },
});

