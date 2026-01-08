import React, { useMemo, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import ClassroomsTab from "./tabs/ClassroomsTab";
import OperatingHoursTab from "./tabs/OperatingHoursTab";
import { COLORS } from "../../../../colors";

type TSettingsTab = "classrooms" | "operatingHours";

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState<TSettingsTab>("classrooms");

  const tabs = useMemo(
    () => [
      { key: "classrooms" as TSettingsTab, label: "Classrooms" },
      { key: "operatingHours" as TSettingsTab, label: "Operating Hours" },
    ],
    []
  );

  return (
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

      <View style={styles.contentWrapper}>
        {activeTab === "classrooms" ? <ClassroomsTab /> : <OperatingHoursTab />}
      </View>
    </View>
  );
};

export default SettingsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: COLORS.white,
    padding: 4,
    marginBottom: 16,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 13,
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



