import React, { useMemo } from "react";
import SafeView from "../../@ui/safe-view/SafeView";
import AppHeader from "../../@ui/app-header/AppHeader";
import ThemeScrollView from "../../@ui/theme-scroll-view/ThemeScrollView";
import EmptyNotifications from "./components/EmptyNotifications";
import { useNotificationDetailsQuery } from "../../apis/hooks/notification-hub/query/useNotificationDetails.query";
import { useNavigation } from "@react-navigation/native";
import { TScreenNavigator } from "../../types/navigator/screen-navigator";
import NotificationCard from "./components/NotificationCard";

const Notifications = () => {
  // const { data, isLoading, refetch } = useNotificationDetailsQuery();
  const navigation = useNavigation<TScreenNavigator>();

   // Fetching notification data for each type
   const { data: birthdayData, isLoading: isBirthdayLoading } = useNotificationDetailsQuery("birthday");
   const { data: overDueData, isLoading: isOverdueLoading } = useNotificationDetailsQuery("overDue");
   const { data: upcomingPaymentData, isLoading: isUpcomingLoading } = useNotificationDetailsQuery("upcomingPayment");
   const { data: leadsData, isLoading: isLeadsLoading } = useNotificationDetailsQuery("leads");

   const isLoading = isBirthdayLoading || isOverdueLoading || isUpcomingLoading || isLeadsLoading;
// console.log('leadsssssssss',leadsData);
const leadCount =
  (leadsData?.data?.presentDayLeads?.leads?.length || 0) +
  (leadsData?.data?.allDueLeads?.leads?.length || 0) +
  (leadsData?.data?.allUpcomingLeads?.leads?.length || 0);

console.log("Lead Count:", leadCount);
  return (
    <SafeView>
      <AppHeader
        title="Notification"
        showDrawer={false}
        handleBackClick={() => navigation.goBack()}
      />
      <ThemeScrollView loading={isLoading}>
        {/* Display empty message if no notifications are available */}
        {!birthdayData && !overDueData && !upcomingPaymentData && !leadsData && <EmptyNotifications />}

        {/* Render notification cards for each type based on the fetched data */}
        {birthdayData && (
          <NotificationCard
          count={
            (birthdayData?.birthdays?.employee?.length || 0) + (birthdayData?.birthdays?.student?.length || 0)
          }
          handleClick={() => navigation.navigate("BirthdayNotification")}
          title="Birthday"
          />
        )}

        {/* */}
        {overDueData && (
          <NotificationCard
            count={overDueData?.overDue?.length || 0}
             handleClick={() => navigation.navigate("OverduePaymentsNotifications")}
             title="Overdue payments"
           />
        )}

        {/**/}
        {upcomingPaymentData && (
          <NotificationCard
           count={upcomingPaymentData?.upcomingForecast?.length || 0}
           handleClick={() => navigation.navigate("ForecastDaysNotifications")}
            title="5 days forecast"
          />
        )}

        {/**/}
        {leadsData && (
 <NotificationCard
 count={leadCount}
 handleClick={() => navigation.navigate("LeadsNotifications")}
 title="Lead Management"
/>
)}
      </ThemeScrollView>
    </SafeView>
  );
};

export default Notifications;

