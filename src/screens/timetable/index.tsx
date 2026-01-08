import React, { useMemo, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from "react-native";
import SafeView from "../../@ui/safe-view/SafeView";
import AppHeader from "../../@ui/app-header/AppHeader";
import TimetableView from "./components/timetable/TimetableView";
import SettingsView from "./components/settings/SettingsView";
import { COLORS } from "../../colors";

type TTopTab = "timetable" | "settings";

const TimetableScreen = () => {
  const [activeTab, setActiveTab] = useState<TTopTab>("timetable");

  const tabs = useMemo(
    () => [
      { key: "timetable" as TTopTab, label: "Time Table" },
      { key: "settings" as TTopTab, label: "Settings" },
    ],
    []
  );

  return (
    <SafeView>
      <AppHeader title="Timetable" showDrawer />
      <View style={styles.container}>
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
          </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView 
          style={styles.contentWrapper}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
        >
          {activeTab === "timetable" ? (
            <TimetableView onRequestClassroomsTab={() => setActiveTab("settings")} />
          ) : (
            <SettingsView />
          )}
        </ScrollView>
      </View>
    </SafeView>
  );
};

export default TimetableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#F7F8FA",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary ?? "#6B7280",
  },
  tabLabelActive: {
    color: COLORS.white,
  },
  contentWrapper: {
    flex: 1,
  },
});
