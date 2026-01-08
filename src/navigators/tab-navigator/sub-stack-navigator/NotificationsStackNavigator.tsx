import React from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Notifications from "../../../screens/notifications";
import BirthdayNotification from "../../../screens/notifications/birthday-notifications";
import ForecastNotifications from "../../../screens/notifications/forecast-notifications";
import LeadsNotification from "../../../screens/notifications/leads-notifications";
import OverduePaymentNotification from "../../../screens/notifications/overdue-payment-notifications";

const NotificationStackNavigator = () => {
  const Stack = createNativeStackNavigator<TNotificationStackNavigatorParams>();
  return (
    <Stack.Navigator
      initialRouteName="Notifications"
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen
        name="BirthdayNotification"
        component={BirthdayNotification}
      />

      <Stack.Screen
        name="ForecastDaysNotifications"
        component={ForecastNotifications}
      />

      <Stack.Screen name="LeadsNotifications" component={LeadsNotification} />

      <Stack.Screen
        name="OverduePaymentsNotifications"
        component={OverduePaymentNotification}
      />
    </Stack.Navigator>
  );
};

export default NotificationStackNavigator;

export type TNotificationStackNavigator =
  NativeStackNavigationProp<TNotificationStackNavigatorParams>;
