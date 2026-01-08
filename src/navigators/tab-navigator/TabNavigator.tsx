import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomBottomTab from "../../@ui/bottom-tabs/BottomTabs";
import HomeStackNavigator from "./sub-stack-navigator/HomeStackNavigator";
import ProfileStackNavigator from "./sub-stack-navigator/ProfileStackNavigator";
import NotificationStackNavigator from "./sub-stack-navigator/NotificationsStackNavigator";
import ExpensesStackNavigator from "./sub-stack-navigator/ExpensesStackNavigator";
import AttendanceStackNavigator from "./sub-stack-navigator/AttendanceStackNavigator";
import { hasAnyPermission } from "../../utils/fetchPermissionsTitle";

const TabNavigator = () => {
  const Tab = createBottomTabNavigator<TTabNavigatorParams>();
  
  // Check permissions for each tab
  const hasExpensesPermission = hasAnyPermission("Expenses");
  const hasAttendancePermission = hasAnyPermission("Attendance");
  
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomBottomTab {...props} />} >
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
      {hasExpensesPermission && (
        <Tab.Screen name="ExpensesStack" component={ExpensesStackNavigator} />
      )}
      <Tab.Screen name="NotificationsStack"component={NotificationStackNavigator}/>
      {hasAttendancePermission && (
        <Tab.Screen name="AttendanceStack" component={AttendanceStackNavigator} />
      )}
      <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
